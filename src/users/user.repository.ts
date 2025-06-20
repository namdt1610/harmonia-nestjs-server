import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { User, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    playlists: true;
    favoriteTracks: { include: { track: true } };
    favoriteArtists: { include: { artist: true } };
    favoriteAlbums: { include: { album: true } };
    subscription: { include: { plan: true } };
    activities: true;
    recentlyPlayed: { include: { track: true } };
    streamQueues: { include: { tracks: { include: { track: true } } } };
  };
}>;

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByGoogleSub(googleSub: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { googleSub },
    });
  }

  async findWithRelations(id: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        playlists: true,
        favoriteTracks: { include: { track: true } },
        favoriteArtists: { include: { artist: true } },
        favoriteAlbums: { include: { album: true } },
        subscription: { include: { plan: true } },
        activities: { orderBy: { createdAt: 'desc' }, take: 10 },
        recentlyPlayed: {
          include: { track: true },
          orderBy: { playedAt: 'desc' },
          take: 10,
        },
        streamQueues: {
          include: {
            tracks: {
              include: { track: true },
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });
  }

  async findAllWithPagination(
    page = 1,
    limit = 10,
    filters: {
      isActive?: boolean;
      isStaff?: boolean;
      search?: string;
    } = {},
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: Prisma.UserWhereInput = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isStaff !== undefined) {
      where.isStaff = filters.isStaff;
    }

    if (filters.search) {
      where.OR = [
        { username: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateLastLogin(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { lastLogin: new Date() },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async addToFavorites(
    userId: string,
    itemType: 'track' | 'artist' | 'album',
    itemId: string,
  ): Promise<boolean> {
    try {
      switch (itemType) {
        case 'track':
          await this.prisma.userFavoriteTrack.create({
            data: { userId, trackId: itemId },
          });
          break;
        case 'artist':
          await this.prisma.userFavoriteArtist.create({
            data: { userId, artistId: itemId },
          });
          break;
        case 'album':
          await this.prisma.userFavoriteAlbum.create({
            data: { userId, albumId: itemId },
          });
          break;
      }
      return true;
    } catch (error) {
      if (error.code === 'P2002') {
        return false; // Already exists
      }
      throw error;
    }
  }

  async removeFromFavorites(
    userId: string,
    itemType: 'track' | 'artist' | 'album',
    itemId: string,
  ): Promise<boolean> {
    try {
      switch (itemType) {
        case 'track':
          await this.prisma.userFavoriteTrack.delete({
            where: { userId_trackId: { userId, trackId: itemId } },
          });
          break;
        case 'artist':
          await this.prisma.userFavoriteArtist.delete({
            where: { userId_artistId: { userId, artistId: itemId } },
          });
          break;
        case 'album':
          await this.prisma.userFavoriteAlbum.delete({
            where: { userId_albumId: { userId, albumId: itemId } },
          });
          break;
      }
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false; // Not found
      }
      throw error;
    }
  }

  async addRecentlyPlayed(userId: string, trackId: string): Promise<void> {
    await this.prisma.userRecentTrack.upsert({
      where: { userId_trackId: { userId, trackId } },
      update: { playedAt: new Date() },
      create: { userId, trackId, playedAt: new Date() },
    });

    // Keep only the last 50 recently played tracks
    const recentTracks = await this.prisma.userRecentTrack.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' },
      skip: 50,
    });

    if (recentTracks.length > 0) {
      await this.prisma.userRecentTrack.deleteMany({
        where: {
          userId,
          trackId: { in: recentTracks.map((track) => track.trackId) },
        },
      });
    }
  }

  async getRecentlyPlayed(userId: string, limit = 10): Promise<any[]> {
    const recentTracks = await this.prisma.userRecentTrack.findMany({
      where: { userId },
      include: {
        track: {
          include: {
            artist: true,
            album: true,
          },
        },
      },
      orderBy: { playedAt: 'desc' },
      take: limit,
    });

    return recentTracks.map((rt) => ({
      ...rt.track,
      playedAt: rt.playedAt,
    }));
  }

  async getFavorites(
    userId: string,
    type?: 'track' | 'artist' | 'album',
  ): Promise<any> {
    if (type === 'track') {
      return this.prisma.userFavoriteTrack.findMany({
        where: { userId },
        include: {
          track: {
            include: { artist: true, album: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (type === 'artist') {
      return this.prisma.userFavoriteArtist.findMany({
        where: { userId },
        include: { artist: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (type === 'album') {
      return this.prisma.userFavoriteAlbum.findMany({
        where: { userId },
        include: {
          album: {
            include: { artist: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Return all favorites
    const [tracks, artists, albums] = await Promise.all([
      this.getFavorites(userId, 'track'),
      this.getFavorites(userId, 'artist'),
      this.getFavorites(userId, 'album'),
    ]);

    return { tracks, artists, albums };
  }

  async getUserStats(userId: string): Promise<any> {
    const [
      totalPlaylists,
      totalFavoriteTracks,
      totalFavoriteArtists,
      totalFavoriteAlbums,
      totalActivities,
    ] = await Promise.all([
      this.prisma.playlist.count({ where: { userId } }),
      this.prisma.userFavoriteTrack.count({ where: { userId } }),
      this.prisma.userFavoriteArtist.count({ where: { userId } }),
      this.prisma.userFavoriteAlbum.count({ where: { userId } }),
      this.prisma.userActivity.count({ where: { userId } }),
    ]);

    return {
      totalPlaylists,
      totalFavoriteTracks,
      totalFavoriteArtists,
      totalFavoriteAlbums,
      totalActivities,
    };
  }
}

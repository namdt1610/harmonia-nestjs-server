import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Artist, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

type ArtistWithRelations = Prisma.ArtistGetPayload<{
  include: {
    albums: true;
    tracks: true;
    followers: { include: { user: true } };
  };
}>;

@Injectable()
export class ArtistRepository extends BaseRepository<Artist> {
  constructor(prisma: PrismaService) {
    super(prisma, 'artist');
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({
      data: createArtistDto,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    artists: Artist[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where: Prisma.ArtistWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { bio: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [artists, total] = await Promise.all([
      this.prisma.artist.findMany({
        where,
        skip,
        take: limit,
        include: {
          tracks: {
            select: {
              id: true,
              title: true,
              image: true,
              duration: true,
              playCount: true,
            },
            take: 5,
            orderBy: { playCount: 'desc' },
          },
          albums: {
            select: { id: true, title: true, image: true, releaseDate: true },
            take: 5,
            orderBy: { releaseDate: 'desc' },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.artist.count({ where }),
    ]);

    return {
      artists,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ArtistWithRelations | null> {
    return this.prisma.artist.findUnique({
      where: { id },
      include: {
        tracks: {
          orderBy: { playCount: 'desc' },
          take: 10,
        },
        albums: {
          orderBy: { releaseDate: 'desc' },
        },
        followers: {
          include: { user: true },
          take: 10,
        },
      },
    });
  }

  async findByName(name: string): Promise<Artist | null> {
    return this.prisma.artist.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async findByIds(ids: string[]): Promise<Artist[]> {
    return this.prisma.artist.findMany({
      where: { id: { in: ids } },
      include: {
        tracks: {
          select: { id: true, title: true, image: true, duration: true },
          take: 5,
        },
        albums: {
          select: { id: true, title: true, image: true, releaseDate: true },
          take: 5,
        },
      },
    });
  }

  async findPopular(limit = 10): Promise<any[]> {
    // Use aggregation to get artists with most plays
    const artists = await this.prisma.artist.findMany({
      include: {
        tracks: {
          select: { playCount: true },
        },
        albums: {
          select: { id: true, title: true, image: true, releaseDate: true },
          take: 3,
        },
      },
      take: limit * 2, // Get more to sort by total plays
    });

    // Calculate total plays and sort
    const artistsWithPlays = artists.map((artist) => ({
      ...artist,
      totalPlays: artist.tracks.reduce(
        (sum, track) => sum + (track.playCount || 0),
        0,
      ),
    }));

    return artistsWithPlays
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, limit);
  }

  async findRecent(limit = 10): Promise<Artist[]> {
    return this.prisma.artist.findMany({
      include: {
        tracks: {
          select: { id: true, title: true, image: true, duration: true },
          take: 3,
        },
        albums: {
          select: { id: true, title: true, image: true, releaseDate: true },
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | null> {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: updateArtistDto,
        include: {
          tracks: {
            select: { id: true, title: true, image: true, duration: true },
            take: 5,
          },
          albums: {
            select: { id: true, title: true, image: true, releaseDate: true },
            take: 5,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Artist | null> {
    try {
      return await this.prisma.artist.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async search(query: string, limit = 20): Promise<Artist[]> {
    return this.prisma.artist.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        tracks: {
          select: { id: true, title: true, image: true, duration: true },
          take: 3,
        },
        albums: {
          select: { id: true, title: true, image: true, releaseDate: true },
          take: 3,
        },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async getArtistStats(artistId: string): Promise<any> {
    const [totalTracks, totalAlbums, totalFollowers, totalPlays] =
      await Promise.all([
        this.prisma.track.count({ where: { artistId } }),
        this.prisma.album.count({ where: { artistId } }),
        this.prisma.userFavoriteArtist.count({ where: { artistId } }),
        this.prisma.track.aggregate({
          where: { artistId },
          _sum: { playCount: true },
        }),
      ]);

    return {
      totalTracks,
      totalAlbums,
      totalFollowers,
      totalPlays: totalPlays._sum.playCount || 0,
    };
  }

  async getTopTracks(artistId: string, limit = 10): Promise<any[]> {
    return this.prisma.track.findMany({
      where: { artistId },
      include: {
        album: true,
        genres: { include: { genre: true } },
      },
      orderBy: { playCount: 'desc' },
      take: limit,
    });
  }

  async getAlbums(artistId: string): Promise<any[]> {
    return this.prisma.album.findMany({
      where: { artistId },
      include: {
        tracks: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { releaseDate: 'desc' },
    });
  }

  async addFollower(artistId: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.userFavoriteArtist.create({
        data: { artistId, userId },
      });
      return true;
    } catch (error) {
      if (error.code === 'P2002') {
        return false; // Already following
      }
      throw error;
    }
  }

  async removeFollower(artistId: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.userFavoriteArtist.delete({
        where: { userId_artistId: { userId, artistId } },
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false; // Not following
      }
      throw error;
    }
  }

  async isFollowing(artistId: string, userId: string): Promise<boolean> {
    const follow = await this.prisma.userFavoriteArtist.findUnique({
      where: { userId_artistId: { userId, artistId } },
    });
    return !!follow;
  }

  async getFollowers(artistId: string, page = 1, limit = 10): Promise<any> {
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      this.prisma.userFavoriteArtist.findMany({
        where: { artistId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userFavoriteArtist.count({ where: { artistId } }),
    ]);

    return {
      followers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Favorite, Prisma } from '@prisma/client';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

// Define enums that match the original schema
export enum FavoriteType {
  TRACK = 'TRACK',
  ARTIST = 'ARTIST',
  ALBUM = 'ALBUM',
  PLAYLIST = 'PLAYLIST',
}

type FavoriteWithUser = Favorite & {
  user: {
    id: string;
    username: string;
    email: string;
  };
};

@Injectable()
export class FavoriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    return this.prisma.favorite.create({
      data: {
        userId: createFavoriteDto.user,
        contentType: createFavoriteDto.type,
        contentId: createFavoriteDto.itemId,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: {
      userId?: string;
      type?: FavoriteType;
    } = {},
  ): Promise<{
    favorites: FavoriteWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: Prisma.FavoriteWhereInput = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.type) {
      where.contentType = filters.type;
    }

    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.favorite.count({ where }),
    ]);

    return {
      favorites,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<FavoriteWithUser | null> {
    return this.prisma.favorite.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUser(
    userId: string,
    type?: FavoriteType,
    page = 1,
    limit = 10,
  ): Promise<{
    favorites: FavoriteWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: Prisma.FavoriteWhereInput = { userId };

    if (type) {
      where.contentType = type;
    }

    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.favorite.count({ where }),
    ]);

    return {
      favorites,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUserFavoritesByType(
    userId: string,
    type: FavoriteType,
  ): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: {
        userId,
        contentType: type,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async findUserFavoriteTracks(userId: string): Promise<Favorite[]> {
    return this.findUserFavoritesByType(userId, FavoriteType.TRACK);
  }

  async findUserFavoriteArtists(userId: string): Promise<Favorite[]> {
    return this.findUserFavoritesByType(userId, FavoriteType.ARTIST);
  }

  async findUserFavoriteAlbums(userId: string): Promise<Favorite[]> {
    return this.findUserFavoritesByType(userId, FavoriteType.ALBUM);
  }

  async findUserFavoritePlaylists(userId: string): Promise<Favorite[]> {
    return this.findUserFavoritesByType(userId, FavoriteType.PLAYLIST);
  }

  async isItemFavorited(
    userId: string,
    itemId: string,
    type: FavoriteType,
  ): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_contentType_contentId: {
          userId,
          contentType: type,
          contentId: itemId,
        },
      },
    });

    return !!favorite;
  }

  async addToFavorites(
    userId: string,
    itemId: string,
    type: FavoriteType,
  ): Promise<Favorite | null> {
    try {
      // Use upsert to handle the case where it already exists
      const favorite = await this.prisma.favorite.upsert({
        where: {
          userId_contentType_contentId: {
            userId,
            contentType: type,
            contentId: itemId,
          },
        },
        update: {}, // No updates needed, just return existing
        create: {
          userId,
          contentType: type,
          contentId: itemId,
        },
      });

      return favorite;
    } catch (error) {
      return null;
    }
  }

  async removeFromFavorites(
    userId: string,
    itemId: string,
    type: FavoriteType,
  ): Promise<boolean> {
    try {
      await this.prisma.favorite.delete({
        where: {
          userId_contentType_contentId: {
            userId,
            contentType: type,
            contentId: itemId,
          },
        },
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false; // Not found
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.favorite.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async getUserFavoriteCount(userId: string): Promise<number> {
    return this.prisma.favorite.count({
      where: { userId },
    });
  }

  async getUserFavoriteCountsByType(userId: string): Promise<{
    tracks: number;
    artists: number;
    albums: number;
    playlists: number;
    total: number;
  }> {
    const [tracks, artists, albums, playlists, total] = await Promise.all([
      this.prisma.favorite.count({
        where: { userId, contentType: FavoriteType.TRACK },
      }),
      this.prisma.favorite.count({
        where: { userId, contentType: FavoriteType.ARTIST },
      }),
      this.prisma.favorite.count({
        where: { userId, contentType: FavoriteType.ALBUM },
      }),
      this.prisma.favorite.count({
        where: { userId, contentType: FavoriteType.PLAYLIST },
      }),
      this.prisma.favorite.count({
        where: { userId },
      }),
    ]);

    return {
      tracks,
      artists,
      albums,
      playlists,
      total,
    };
  }

  async getMostFavoritedItems(
    type: FavoriteType,
    limit = 10,
  ): Promise<{ itemId: string; count: number }[]> {
    const result = await this.prisma.$queryRaw<
      Array<{ contentId: string; count: bigint }>
    >`
      SELECT content_id as "contentId", COUNT(*) as count
      FROM favorites
      WHERE content_type = ${type}
      GROUP BY content_id
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return result.map((item) => ({
      itemId: item.contentId,
      count: Number(item.count),
    }));
  }

  async getStatistics(): Promise<{
    totalFavorites: number;
    favoritesByType: Record<FavoriteType, number>;
    uniqueUsers: number;
    averageFavoritesPerUser: number;
  }> {
    const [totalFavorites, uniqueUsersCount] = await Promise.all([
      this.prisma.favorite.count(),
      this.prisma.favorite
        .findMany({
          select: { userId: true },
          distinct: ['userId'],
        })
        .then((users) => users.length),
    ]);

    const favoritesByTypeRaw = await this.prisma.$queryRaw<
      Array<{ contentType: string; count: bigint }>
    >`
      SELECT content_type as "contentType", COUNT(*) as count
      FROM favorites
      GROUP BY content_type
    `;

    const favoritesByType = favoritesByTypeRaw.reduce(
      (acc, item) => {
        acc[item.contentType as FavoriteType] = Number(item.count);
        return acc;
      },
      {} as Record<FavoriteType, number>,
    );

    // Ensure all types are represented
    Object.values(FavoriteType).forEach((type) => {
      if (!(type in favoritesByType)) {
        favoritesByType[type] = 0;
      }
    });

    const averageFavoritesPerUser =
      uniqueUsersCount > 0 ? totalFavorites / uniqueUsersCount : 0;

    return {
      totalFavorites,
      favoritesByType,
      uniqueUsers: uniqueUsersCount,
      averageFavoritesPerUser: Math.round(averageFavoritesPerUser * 100) / 100,
    };
  }

  async clearUserFavorites(userId: string): Promise<boolean> {
    try {
      await this.prisma.favorite.deleteMany({
        where: { userId },
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
}

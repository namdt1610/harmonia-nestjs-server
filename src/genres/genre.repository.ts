import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Genre, Prisma } from '@prisma/client';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

type GenreWithRelations = Prisma.GenreGetPayload<{
  include: {
    tracks: {
      include: {
        track: {
          include: {
            artist: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class GenreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.prisma.genre.create({
      data: createGenreDto,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    genres: Genre[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where: Prisma.GenreWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [genres, total] = await Promise.all([
      this.prisma.genre.findMany({
        where,
        skip,
        take: limit,
        include: {
          tracks: {
            include: {
              track: {
                select: {
                  id: true,
                  title: true,
                  image: true,
                  playCount: true,
                },
                include: {
                  artist: {
                    select: { id: true, name: true, image: true },
                  },
                },
              },
            },
            take: 5, // Limit tracks for overview
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.genre.count({ where }),
    ]);

    return {
      genres,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<GenreWithRelations | null> {
    return this.prisma.genre.findUnique({
      where: { id },
      include: {
        tracks: {
          include: {
            track: {
              select: {
                id: true,
                title: true,
                image: true,
                duration: true,
                playCount: true,
                createdAt: true,
              },
              include: {
                artist: {
                  select: { id: true, name: true, image: true, bio: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByName(name: string): Promise<Genre | null> {
    return this.prisma.genre.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async findByIds(ids: string[]): Promise<Genre[]> {
    return this.prisma.genre.findMany({
      where: { id: { in: ids } },
      include: {
        tracks: {
          include: {
            track: {
              select: {
                id: true,
                title: true,
                image: true,
              },
              include: {
                artist: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
          },
          take: 5, // Limit tracks for overview
        },
      },
    });
  }

  async findPopular(limit = 10): Promise<any[]> {
    // Get genres with their track counts and total plays
    const genres = await this.prisma.genre.findMany({
      include: {
        tracks: {
          include: {
            track: {
              select: { playCount: true },
            },
          },
        },
      },
      take: limit * 2, // Get more to sort by popularity
    });

    // Calculate popularity metrics and sort
    const genresWithStats = genres.map((genre) => ({
      ...genre,
      trackCount: genre.tracks.length,
      totalPlays: genre.tracks.reduce(
        (sum, gt) => sum + (gt.track.playCount || 0),
        0,
      ),
    }));

    return genresWithStats
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, limit);
  }

  async update(
    id: string,
    updateGenreDto: UpdateGenreDto,
  ): Promise<Genre | null> {
    try {
      return await this.prisma.genre.update({
        where: { id },
        data: updateGenreDto,
        include: {
          tracks: {
            include: {
              track: {
                select: {
                  id: true,
                  title: true,
                  image: true,
                },
                include: {
                  artist: {
                    select: { id: true, name: true, image: true },
                  },
                },
              },
            },
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

  async delete(id: string): Promise<Genre | null> {
    try {
      return await this.prisma.genre.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async search(query: string, limit = 20): Promise<Genre[]> {
    return this.prisma.genre.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        tracks: {
          include: {
            track: {
              select: {
                id: true,
                title: true,
                image: true,
              },
              include: {
                artist: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
          },
          take: 3, // Limit tracks for search results
        },
      },
      take: limit,
    });
  }

  async getGenreStats(genreId: string): Promise<any> {
    const genre = await this.prisma.genre.findUnique({
      where: { id: genreId },
      include: {
        tracks: {
          include: {
            track: {
              select: { playCount: true, downloadCount: true, duration: true },
            },
          },
        },
      },
    });

    if (!genre) {
      return null;
    }

    const totalTracks = genre.tracks.length;
    const totalPlays = genre.tracks.reduce(
      (sum, gt) => sum + (gt.track.playCount || 0),
      0,
    );
    const totalDownloads = genre.tracks.reduce(
      (sum, gt) => sum + (gt.track.downloadCount || 0),
      0,
    );
    const totalDuration = genre.tracks.reduce(
      (sum, gt) => sum + (gt.track.duration || 0),
      0,
    );

    return {
      totalTracks,
      totalPlays,
      totalDownloads,
      totalDuration,
    };
  }

  async getTracksInGenre(genreId: string, page = 1, limit = 20): Promise<any> {
    const skip = (page - 1) * limit;

    const [tracks, total] = await Promise.all([
      this.prisma.trackGenre.findMany({
        where: { genreId },
        skip,
        take: limit,
        include: {
          track: {
            include: {
              artist: {
                select: { id: true, name: true, image: true },
              },
              album: {
                select: { id: true, title: true, image: true },
              },
            },
          },
        },
        orderBy: { track: { playCount: 'desc' } },
      }),
      this.prisma.trackGenre.count({ where: { genreId } }),
    ]);

    return {
      tracks: tracks.map((tg) => tg.track),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

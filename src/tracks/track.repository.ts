import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Track, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

type TrackWithRelations = Prisma.TrackGetPayload<{
  include: {
    artist: true;
    album: true;
    genres: { include: { genre: true } };
    favorites: { include: { user: true } };
  };
}>;

@Injectable()
export class TrackRepository extends BaseRepository<Track> {
  constructor(prisma: PrismaService) {
    super(prisma, 'track');
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const { genres, ...trackData } = createTrackDto;

    return this.prisma.track.create({
      data: {
        ...trackData,
        artistId: createTrackDto.artist,
        albumId: createTrackDto.album || null,
        genres: genres
          ? {
              create: genres.map((genreId) => ({
                genre: { connect: { id: genreId } },
              })),
            }
          : undefined,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    artistId?: string,
    albumId?: string,
    genreId?: string,
  ): Promise<{
    tracks: Track[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where: Prisma.TrackWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { lyrics: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (artistId) {
      where.artistId = artistId;
    }

    if (albumId) {
      where.albumId = albumId;
    }

    if (genreId) {
      where.genres = {
        some: { genreId },
      };
    }

    const [tracks, total] = await Promise.all([
      this.prisma.track.findMany({
        where,
        skip,
        take: limit,
        include: {
          artist: {
            select: { id: true, name: true, image: true },
          },
          album: {
            select: { id: true, title: true, image: true },
          },
          genres: {
            include: {
              genre: {
                select: { id: true, name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.track.count({ where }),
    ]);

    return {
      tracks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<TrackWithRelations | null> {
    return this.prisma.track.findUnique({
      where: { id },
      include: {
        artist: {
          select: { id: true, name: true, image: true, bio: true },
        },
        album: {
          select: { id: true, title: true, image: true, releaseDate: true },
        },
        genres: {
          include: {
            genre: {
              select: { id: true, name: true, description: true },
            },
          },
        },
        favorites: {
          include: { user: true },
          take: 10,
        },
      },
    });
  }

  async findByIds(ids: string[]): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: { id: { in: ids } },
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        album: {
          select: { id: true, title: true, image: true },
        },
        genres: {
          include: {
            genre: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async findByArtist(artistId: string): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: { artistId },
      include: {
        album: {
          select: { id: true, title: true, image: true },
        },
        genres: {
          include: {
            genre: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAlbum(albumId: string): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: { albumId },
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        genres: {
          include: {
            genre: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByGenre(genreId: string): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: {
        genres: {
          some: { genreId },
        },
      },
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        album: {
          select: { id: true, title: true, image: true },
        },
      },
      orderBy: { playCount: 'desc' },
    });
  }

  async findPopular(limit = 10): Promise<Track[]> {
    return this.prisma.track.findMany({
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        album: {
          select: { id: true, title: true, image: true },
        },
        genres: {
          include: {
            genre: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { playCount: 'desc' },
      take: limit,
    });
  }

  async findRecent(limit = 10): Promise<Track[]> {
    return this.prisma.track.findMany({
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        album: {
          select: { id: true, title: true, image: true },
        },
        genres: {
          include: {
            genre: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track | null> {
    try {
      const { genres, ...trackData } = updateTrackDto;
      const updateData: any = { ...trackData };

      if (updateTrackDto.artist) {
        updateData.artistId = updateTrackDto.artist;
        delete updateData.artist;
      }

      if (updateTrackDto.album) {
        updateData.albumId = updateTrackDto.album;
        delete updateData.album;
      }

      // Handle genres separately if provided
      if (genres) {
        // First delete existing genre relationships
        await this.prisma.trackGenre.deleteMany({
          where: { trackId: id },
        });

        // Then create new relationships
        updateData.genres = {
          create: genres.map((genreId) => ({
            genre: { connect: { id: genreId } },
          })),
        };
      }

      return await this.prisma.track.update({
        where: { id },
        data: updateData,
        include: {
          artist: {
            select: { id: true, name: true, image: true },
          },
          album: {
            select: { id: true, title: true, image: true },
          },
          genres: {
            include: {
              genre: {
                select: { id: true, name: true },
              },
            },
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

  async delete(id: string): Promise<Track | null> {
    try {
      return await this.prisma.track.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async incrementPlayCount(id: string): Promise<Track | null> {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          playCount: { increment: 1 },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async incrementDownloadCount(id: string): Promise<Track | null> {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          downloadCount: { increment: 1 },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async search(query: string, limit = 20): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { lyrics: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        album: {
          select: { id: true, title: true, image: true },
        },
        genres: {
          include: {
            genre: {
              select: { id: true, name: true },
            },
          },
        },
      },
      take: limit,
    });
  }
}

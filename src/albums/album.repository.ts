import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Album, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

type AlbumWithRelations = Prisma.AlbumGetPayload<{
  include: {
    artist: true;
    tracks: true;
    favorites: { include: { user: true } };
  };
}>;

@Injectable()
export class AlbumRepository extends BaseRepository<Album> {
  constructor(prisma: PrismaService) {
    super(prisma, 'album');
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        ...createAlbumDto,
        artistId: createAlbumDto.artist,
        releaseDate: createAlbumDto.releaseDate
          ? new Date(createAlbumDto.releaseDate)
          : undefined,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    artistId?: string,
  ): Promise<{
    albums: Album[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where: Prisma.AlbumWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (artistId) {
      where.artistId = artistId;
    }

    const [albums, total] = await Promise.all([
      this.prisma.album.findMany({
        where,
        skip,
        take: limit,
        include: {
          artist: {
            select: { id: true, name: true, image: true, bio: true },
          },
          tracks: {
            select: { id: true, title: true, duration: true, playCount: true },
          },
        },
        orderBy: { releaseDate: 'desc' },
      }),
      this.prisma.album.count({ where }),
    ]);

    return {
      albums,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<AlbumWithRelations | null> {
    return this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: {
          select: { id: true, name: true, image: true, bio: true },
        },
        tracks: {
          select: {
            id: true,
            title: true,
            duration: true,
            playCount: true,
            lyrics: true,
            file: true,
          },
        },
        favorites: {
          include: { user: true },
          take: 10,
        },
      },
    });
  }

  async findByTitle(title: string): Promise<Album | null> {
    return this.prisma.album.findFirst({
      where: {
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
      },
    });
  }

  async findByArtist(artistId: string): Promise<Album[]> {
    return this.prisma.album.findMany({
      where: { artistId },
      include: {
        tracks: {
          select: { id: true, title: true, duration: true, playCount: true },
        },
      },
      orderBy: { releaseDate: 'desc' },
    });
  }

  async findByIds(ids: string[]): Promise<Album[]> {
    return this.prisma.album.findMany({
      where: { id: { in: ids } },
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        tracks: {
          select: { id: true, title: true, duration: true },
        },
      },
    });
  }

  async findPopular(limit = 10): Promise<any[]> {
    // Get albums with their track play counts
    const albums = await this.prisma.album.findMany({
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        tracks: {
          select: { playCount: true },
        },
      },
      take: limit * 2, // Get more to sort by total plays
    });

    // Calculate total plays and sort
    const albumsWithPlays = albums.map((album) => ({
      ...album,
      totalPlays: album.tracks.reduce(
        (sum, track) => sum + (track.playCount || 0),
        0,
      ),
    }));

    return albumsWithPlays
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, limit);
  }

  async findRecent(limit = 10): Promise<Album[]> {
    return this.prisma.album.findMany({
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        tracks: {
          select: { id: true, title: true, duration: true },
        },
      },
      orderBy: { releaseDate: 'desc' },
      take: limit,
    });
  }

  async findNewReleases(limit = 10): Promise<Album[]> {
    return this.prisma.album.findMany({
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        tracks: {
          select: { id: true, title: true, duration: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | null> {
    try {
      const updateData: any = { ...updateAlbumDto };

      if (updateAlbumDto.artist) {
        updateData.artistId = updateAlbumDto.artist;
        delete updateData.artist;
      }

      if (updateAlbumDto.releaseDate) {
        updateData.releaseDate = new Date(updateAlbumDto.releaseDate);
      }

      return await this.prisma.album.update({
        where: { id },
        data: updateData,
        include: {
          artist: {
            select: { id: true, name: true, image: true },
          },
          tracks: {
            select: { id: true, title: true, duration: true },
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

  async delete(id: string): Promise<Album | null> {
    try {
      return await this.prisma.album.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async search(query: string, limit = 20): Promise<Album[]> {
    return this.prisma.album.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        artist: {
          select: { id: true, name: true, image: true },
        },
        tracks: {
          select: { id: true, title: true, duration: true, playCount: true },
          take: 5,
        },
      },
      take: limit,
    });
  }

  async getAlbumStats(albumId: string): Promise<any> {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
      include: {
        tracks: {
          select: { playCount: true, downloadCount: true },
        },
        favorites: true,
      },
    });

    if (!album) {
      return null;
    }

    const totalPlays = album.tracks.reduce(
      (sum, track) => sum + (track.playCount || 0),
      0,
    );
    const totalDownloads = album.tracks.reduce(
      (sum, track) => sum + (track.downloadCount || 0),
      0,
    );

    return {
      totalTracks: album.tracks.length,
      totalPlays,
      totalDownloads,
      totalFavorites: album.favorites.length,
    };
  }
}

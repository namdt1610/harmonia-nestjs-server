import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Playlist, Prisma } from '@prisma/client';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

type PlaylistWithRelations = Prisma.PlaylistGetPayload<{
  include: {
    user: true;
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
export class PlaylistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const { user, ...playlistData } = createPlaylistDto;
    return this.prisma.playlist.create({
      data: {
        ...playlistData,
        userId: user,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    isPublic?: boolean,
    userId?: string,
  ): Promise<{
    playlists: Playlist[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where: Prisma.PlaylistWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (userId) {
      where.userId = userId;
    }

    const [playlists, total] = await Promise.all([
      this.prisma.playlist.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              firstName: true,
              lastName: true,
            },
          },
          tracks: {
            include: {
              track: {
                select: {
                  id: true,
                  title: true,
                  duration: true,
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
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.playlist.count({ where }),
    ]);

    return {
      playlists,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.playlist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
            firstName: true,
            lastName: true,
            bio: true,
          },
        },
        tracks: {
          include: {
            track: {
              select: {
                id: true,
                title: true,
                duration: true,
                image: true,
                playCount: true,
                lyrics: true,
                file: true,
              },
              include: {
                artist: {
                  select: { id: true, name: true, image: true, bio: true },
                },
              },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async findByUser(userId: string): Promise<Playlist[]> {
    return this.prisma.playlist.findMany({
      where: { userId },
      include: {
        tracks: {
          include: {
            track: {
              select: {
                id: true,
                title: true,
                duration: true,
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async addTrack(
    playlistId: string,
    trackId: string,
  ): Promise<Playlist | null> {
    try {
      // Get the current max position for this playlist
      const maxPosition = await this.prisma.playlistTrack.findFirst({
        where: { playlistId },
        orderBy: { position: 'desc' },
        select: { position: true },
      });

      const nextPosition = (maxPosition?.position || 0) + 1;

      // Add the track to the playlist
      await this.prisma.playlistTrack.create({
        data: {
          playlistId,
          trackId,
          position: nextPosition,
        },
      });

      // Return the updated playlist
      return this.findById(playlistId);
    } catch (error) {
      if (error.code === 'P2025' || error.code === 'P2002') {
        return null; // Not found or already exists
      }
      throw error;
    }
  }

  async removeTrack(
    playlistId: string,
    trackId: string,
  ): Promise<Playlist | null> {
    try {
      await this.prisma.playlistTrack.delete({
        where: {
          playlistId_trackId: {
            playlistId,
            trackId,
          },
        },
      });

      return this.findById(playlistId);
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async update(
    id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist | null> {
    try {
      return await this.prisma.playlist.update({
        where: { id },
        data: updatePlaylistDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Playlist | null> {
    try {
      return await this.prisma.playlist.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async search(query: string, limit = 20): Promise<Playlist[]> {
    return this.prisma.playlist.findMany({
      where: {
        isPublic: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        user: {
          select: { id: true, username: true, image: true },
        },
        tracks: {
          include: {
            track: {
              select: { id: true, title: true, image: true },
              include: {
                artist: {
                  select: { id: true, name: true },
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

  async reorderTracks(
    playlistId: string,
    trackPositions: { trackId: string; position: number }[],
  ): Promise<Playlist | null> {
    try {
      // Update positions in a transaction
      await this.prisma.$transaction(
        trackPositions.map(({ trackId, position }) =>
          this.prisma.playlistTrack.update({
            where: {
              playlistId_trackId: {
                playlistId,
                trackId,
              },
            },
            data: { position },
          }),
        ),
      );

      return this.findById(playlistId);
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  }

  async getPlaylistStats(playlistId: string): Promise<any> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        tracks: {
          include: {
            track: {
              select: { duration: true, playCount: true },
            },
          },
        },
      },
    });

    if (!playlist) {
      return null;
    }

    const totalDuration = playlist.tracks.reduce(
      (sum, pt) => sum + (pt.track.duration || 0),
      0,
    );
    const totalPlays = playlist.tracks.reduce(
      (sum, pt) => sum + (pt.track.playCount || 0),
      0,
    );

    return {
      totalTracks: playlist.tracks.length,
      totalDuration,
      totalPlays,
    };
  }
}

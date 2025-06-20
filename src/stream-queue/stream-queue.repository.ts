import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { StreamQueue, StreamQueueTrack } from '@prisma/client';
import { CreateStreamQueueDto } from './dto/create-stream-queue.dto';
import { UpdateStreamQueueDto } from './dto/update-stream-queue.dto';

type StreamQueueWithRelations = StreamQueue & {
  user: {
    id: string;
    username: string;
    email: string;
  };
  tracks: (StreamQueueTrack & {
    track: {
      id: string;
      title: string;
      artist: {
        id: string;
        name: string;
      };
      album?: {
        id: string;
        title: string;
        image?: string | null;
      } | null;
    };
  })[];
};

@Injectable()
export class StreamQueueRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createStreamQueueDto: CreateStreamQueueDto,
  ): Promise<StreamQueue> {
    const { tracks = [], user, ...queueData } = createStreamQueueDto;

    return (await this.prisma.streamQueue.create({
      data: {
        ...queueData,
        userId: user,
        tracks: {
          create: tracks.map((trackId, index) => ({
            trackId: trackId,
            position: index,
          })),
        },
      },
      include: this.getIncludeOptions(),
    })) as StreamQueueWithRelations;
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: {
      userId?: string;
    } = {},
  ): Promise<{
    queues: StreamQueueWithRelations[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    const skip = (page - 1) * limit;

    const [queues, total] = await Promise.all([
      this.prisma.streamQueue.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastPlayed: 'desc' },
        include: this.getIncludeOptions(),
      }),
      this.prisma.streamQueue.count({ where }),
    ]);

    return {
      queues: queues as StreamQueueWithRelations[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<StreamQueueWithRelations | null> {
    return (await this.prisma.streamQueue.findUnique({
      where: { id },
      include: this.getIncludeOptions(),
    })) as StreamQueueWithRelations | null;
  }

  async findByUser(userId: string): Promise<StreamQueueWithRelations | null> {
    return (await this.prisma.streamQueue.findUnique({
      where: { userId },
      include: this.getIncludeOptions(),
    })) as StreamQueueWithRelations | null;
  }

  async createOrUpdateUserQueue(
    userId: string,
    updateData: UpdateStreamQueueDto,
  ): Promise<StreamQueue> {
    const existingQueue = await this.findByUser(userId);

    if (existingQueue) {
      const updated = await this.update(existingQueue.id, updateData);
      if (!updated) {
        throw new Error('Failed to update queue');
      }
      return updated;
    } else {
      const createDto: CreateStreamQueueDto = {
        user: userId,
        ...updateData,
      };
      return await this.create(createDto);
    }
  }

  async update(
    id: string,
    updateStreamQueueDto: UpdateStreamQueueDto,
  ): Promise<StreamQueueWithRelations | null> {
    try {
      const { tracks, ...updateData } = updateStreamQueueDto;

      return (await this.prisma.streamQueue.update({
        where: { id },
        data: {
          ...updateData,
          lastPlayed: new Date(),
          ...(tracks && {
            tracks: {
              deleteMany: {},
              create: tracks.map((trackId, index) => ({
                trackId: trackId,
                position: index,
              })),
            },
          }),
        },
        include: this.getIncludeOptions(),
      })) as StreamQueueWithRelations;
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.streamQueue.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async addTrack(
    userId: string,
    trackId: string,
    position?: number,
  ): Promise<StreamQueueWithRelations | null> {
    const queue = await this.findByUser(userId);

    if (!queue) {
      // Create new queue with this track
      return (await this.create({
        user: userId,
        tracks: [trackId],
        currentIndex: 0,
      })) as StreamQueueWithRelations;
    }

    // Check if track already exists in queue
    const existingTrack = queue.tracks.find((t) => t.trackId === trackId);
    if (existingTrack) {
      return queue;
    }

    const maxPosition = Math.max(...queue.tracks.map((t) => t.position), -1);
    const newPosition =
      position !== undefined && position >= 0 && position <= maxPosition + 1
        ? position
        : maxPosition + 1;

    // If inserting in the middle, update positions of subsequent tracks
    if (position !== undefined && position <= maxPosition) {
      await this.prisma.streamQueueTrack.updateMany({
        where: {
          queueId: queue.id,
          position: { gte: position },
        },
        data: {
          position: { increment: 1 },
        },
      });
    }

    await this.prisma.streamQueueTrack.create({
      data: {
        queueId: queue.id,
        trackId,
        position: newPosition,
      },
    });

    return await this.findById(queue.id);
  }

  async removeTrack(
    userId: string,
    trackId: string,
  ): Promise<StreamQueueWithRelations | null> {
    const queue = await this.findByUser(userId);
    if (!queue) {
      return null;
    }

    const trackToRemove = queue.tracks.find((t) => t.trackId === trackId);
    if (!trackToRemove) {
      return queue;
    }

    // Remove the track
    await this.prisma.streamQueueTrack.delete({
      where: {
        queueId_trackId: {
          queueId: queue.id,
          trackId,
        },
      },
    });

    // Update positions of subsequent tracks
    await this.prisma.streamQueueTrack.updateMany({
      where: {
        queueId: queue.id,
        position: { gt: trackToRemove.position },
      },
      data: {
        position: { decrement: 1 },
      },
    });

    // Adjust currentIndex if necessary
    let newCurrentIndex = queue.currentIndex;
    if (trackToRemove.position < queue.currentIndex) {
      newCurrentIndex = Math.max(0, queue.currentIndex - 1);
    } else if (trackToRemove.position === queue.currentIndex) {
      newCurrentIndex = Math.min(queue.currentIndex, queue.tracks.length - 2);
    }

    await this.prisma.streamQueue.update({
      where: { id: queue.id },
      data: { currentIndex: newCurrentIndex },
    });

    return await this.findById(queue.id);
  }

  async clearQueue(userId: string): Promise<StreamQueueWithRelations | null> {
    const queue = await this.findByUser(userId);
    if (!queue) {
      return null;
    }

    await this.prisma.streamQueueTrack.deleteMany({
      where: { queueId: queue.id },
    });

    return (await this.prisma.streamQueue.update({
      where: { id: queue.id },
      data: { currentIndex: 0 },
      include: this.getIncludeOptions(),
    })) as StreamQueueWithRelations;
  }

  async setCurrentTrack(
    userId: string,
    trackIndex: number,
  ): Promise<StreamQueueWithRelations | null> {
    const queue = await this.findByUser(userId);
    if (!queue) {
      return null;
    }

    if (trackIndex < 0 || trackIndex >= queue.tracks.length) {
      return queue;
    }

    return (await this.prisma.streamQueue.update({
      where: { id: queue.id },
      data: {
        currentIndex: trackIndex,
        lastPlayed: new Date(),
      },
      include: this.getIncludeOptions(),
    })) as StreamQueueWithRelations;
  }

  async nextTrack(userId: string): Promise<StreamQueueWithRelations | null> {
    const queue = await this.findByUser(userId);
    if (!queue || queue.tracks.length === 0) {
      return queue;
    }

    let nextIndex = queue.currentIndex + 1;

    if (queue.repeat === 'track') {
      nextIndex = queue.currentIndex;
    } else if (nextIndex >= queue.tracks.length) {
      if (queue.repeat === 'playlist') {
        nextIndex = 0;
      } else {
        nextIndex = queue.tracks.length - 1;
      }
    }

    return await this.setCurrentTrack(userId, nextIndex);
  }

  async previousTrack(
    userId: string,
  ): Promise<StreamQueueWithRelations | null> {
    const queue = await this.findByUser(userId);
    if (!queue || queue.tracks.length === 0) {
      return queue;
    }

    let prevIndex = queue.currentIndex - 1;

    if (prevIndex < 0) {
      if (queue.repeat === 'playlist') {
        prevIndex = queue.tracks.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    return await this.setCurrentTrack(userId, prevIndex);
  }

  async toggleShuffle(
    userId: string,
  ): Promise<StreamQueueWithRelations | null> {
    const queue = await this.findByUser(userId);
    if (!queue) {
      return null;
    }

    return (await this.prisma.streamQueue.update({
      where: { id: queue.id },
      data: { shuffle: !queue.shuffle },
      include: this.getIncludeOptions(),
    })) as StreamQueueWithRelations;
  }

  async setRepeatMode(
    userId: string,
    repeatMode: 'off' | 'track' | 'playlist',
  ): Promise<StreamQueueWithRelations | null> {
    const queue = await this.findByUser(userId);
    if (!queue) {
      return null;
    }

    return (await this.prisma.streamQueue.update({
      where: { id: queue.id },
      data: { repeat: repeatMode },
      include: this.getIncludeOptions(),
    })) as StreamQueueWithRelations;
  }

  async getCurrentTrack(userId: string): Promise<any | null> {
    const queue = await this.findByUser(userId);
    if (!queue || queue.tracks.length === 0) {
      return null;
    }

    const currentTrack = queue.tracks.find(
      (t) => t.position === queue.currentIndex,
    );
    return currentTrack?.track || null;
  }

  async getQueueStatistics(): Promise<{
    totalQueues: number;
    queuesWithTracks: number;
    averageTracksPerQueue: number;
    totalTracks: number;
    shuffleModeCount: number;
    repeatModeStats: Record<string, number>;
  }> {
    const [
      totalQueues,
      queuesWithTracks,
      totalTracks,
      shuffleModeCount,
      repeatModeStats,
    ] = await Promise.all([
      this.prisma.streamQueue.count(),
      this.prisma.streamQueue.count({
        where: { tracks: { some: {} } },
      }),
      this.prisma.streamQueueTrack.count(),
      this.prisma.streamQueue.count({
        where: { shuffle: true },
      }),
      this.prisma.streamQueue.groupBy({
        by: ['repeat'],
        _count: true,
      }),
    ]);

    const averageTracksPerQueue =
      totalQueues > 0 ? totalTracks / totalQueues : 0;

    const repeatStats = repeatModeStats.reduce(
      (acc, stat) => {
        acc[stat.repeat] = stat._count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalQueues,
      queuesWithTracks,
      averageTracksPerQueue: Math.round(averageTracksPerQueue * 100) / 100,
      totalTracks,
      shuffleModeCount,
      repeatModeStats: repeatStats,
    };
  }

  private getIncludeOptions() {
    return {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      tracks: {
        include: {
          track: {
            include: {
              artist: {
                select: {
                  id: true,
                  name: true,
                },
              },
              album: {
                select: {
                  id: true,
                  title: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          position: 'asc' as const,
        },
      },
    };
  }
}

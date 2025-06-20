import { Injectable, Logger } from '@nestjs/common';
import { StreamQueueRepository } from './stream-queue.repository';
import { TrackRepository } from '../tracks/track.repository';

export interface QueueTrack {
  id: string;
  track: any;
  addedAt: Date;
  addedBy: string;
  order: number;
}

export interface UserQueue {
  userId: string;
  tracks: QueueTrack[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
  updatedAt: Date;
}

@Injectable()
export class StreamQueueService {
  private readonly logger = new Logger(StreamQueueService.name);

  // In-memory storage for active queues (in production, use Redis or MongoDB)
  private userQueues: Map<string, UserQueue> = new Map();

  constructor(
    private readonly streamQueueRepository: StreamQueueRepository,
    private readonly trackRepository: TrackRepository,
  ) {}

  async getQueue(userId: string): Promise<UserQueue> {
    let queue = this.userQueues.get(userId);

    if (!queue) {
      // Load from database or create new
      const savedQueue = await this.streamQueueRepository.findByUser(userId);

      if (savedQueue) {
        queue = this.mapStreamQueueToUserQueue(savedQueue);
      } else {
        queue = {
          userId,
          tracks: [],
          currentIndex: 0,
          isPlaying: false,
          volume: 1.0,
          repeat: 'none',
          shuffle: false,
          updatedAt: new Date(),
        };
      }

      this.userQueues.set(userId, queue);
    }

    return queue;
  }

  async addTrack(
    userId: string,
    trackId: string,
    position?: number,
  ): Promise<UserQueue> {
    const track = await this.trackRepository.findById(trackId);
    if (!track) {
      throw new Error('Track not found');
    }

    const queue = await this.getQueue(userId);

    // Check if track already exists
    const existingIndex = queue.tracks.findIndex((t) => t.id === trackId);
    if (existingIndex !== -1) {
      return queue;
    }

    const queueTrack: QueueTrack = {
      id: track.id,
      track,
      addedAt: new Date(),
      addedBy: userId,
      order: position !== undefined ? position : queue.tracks.length,
    };

    if (
      position !== undefined &&
      position >= 0 &&
      position <= queue.tracks.length
    ) {
      queue.tracks.splice(position, 0, queueTrack);
    } else {
      queue.tracks.push(queueTrack);
    }

    queue.updatedAt = new Date();
    this.userQueues.set(userId, queue);

    // Save to database
    await this.saveQueueToDatabase(queue);

    this.logger.log(`Track ${trackId} added to queue for user ${userId}`);
    return queue;
  }

  async removeTrack(userId: string, trackIndex: number): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    if (trackIndex < 0 || trackIndex >= queue.tracks.length) {
      throw new Error('Invalid track index');
    }

    queue.tracks.splice(trackIndex, 1);

    // Update order for remaining tracks
    queue.tracks.forEach((track, index) => {
      track.order = index;
    });

    // Adjust current index if necessary
    if (queue.currentIndex >= trackIndex) {
      queue.currentIndex = Math.max(0, queue.currentIndex - 1);
    }

    queue.updatedAt = new Date();
    this.userQueues.set(userId, queue);

    await this.saveQueueToDatabase(queue);

    this.logger.log(
      `Track at index ${trackIndex} removed from queue for user ${userId}`,
    );
    return queue;
  }

  async moveTrack(
    userId: string,
    fromIndex: number,
    toIndex: number,
  ): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    if (
      fromIndex < 0 ||
      fromIndex >= queue.tracks.length ||
      toIndex < 0 ||
      toIndex >= queue.tracks.length
    ) {
      throw new Error('Invalid track indices');
    }

    const [movedTrack] = queue.tracks.splice(fromIndex, 1);
    queue.tracks.splice(toIndex, 0, movedTrack);

    // Update order for all tracks
    queue.tracks.forEach((track, index) => {
      track.order = index;
    });

    // Adjust current index if necessary
    if (queue.currentIndex === fromIndex) {
      queue.currentIndex = toIndex;
    } else if (
      queue.currentIndex > fromIndex &&
      queue.currentIndex <= toIndex
    ) {
      queue.currentIndex--;
    } else if (
      queue.currentIndex < fromIndex &&
      queue.currentIndex >= toIndex
    ) {
      queue.currentIndex++;
    }

    queue.updatedAt = new Date();
    this.userQueues.set(userId, queue);

    await this.saveQueueToDatabase(queue);

    this.logger.log(
      `Track moved from index ${fromIndex} to ${toIndex} for user ${userId}`,
    );
    return queue;
  }

  async clearQueue(userId: string): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    queue.tracks = [];
    queue.currentIndex = 0;
    queue.isPlaying = false;
    queue.updatedAt = new Date();

    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(`Queue cleared for user ${userId}`);
    return queue;
  }

  async setCurrentTrack(
    userId: string,
    trackIndex: number,
  ): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    if (trackIndex < 0 || trackIndex >= queue.tracks.length) {
      throw new Error('Invalid track index');
    }

    queue.currentIndex = trackIndex;
    queue.updatedAt = new Date();

    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(
      `Current track set to index ${trackIndex} for user ${userId}`,
    );
    return queue;
  }

  async nextTrack(userId: string): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    if (queue.tracks.length === 0) {
      return queue;
    }

    if (queue.repeat === 'one') {
      // Stay on current track
      return queue;
    }

    if (queue.shuffle) {
      // Random next track (excluding current)
      const availableIndices = queue.tracks
        .map((_, index) => index)
        .filter((index) => index !== queue.currentIndex);

      if (availableIndices.length > 0) {
        queue.currentIndex =
          availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
    } else {
      // Sequential next
      queue.currentIndex++;

      if (queue.currentIndex >= queue.tracks.length) {
        if (queue.repeat === 'all') {
          queue.currentIndex = 0;
        } else {
          queue.currentIndex = queue.tracks.length - 1;
          queue.isPlaying = false;
        }
      }
    }

    queue.updatedAt = new Date();
    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(
      `Next track for user ${userId}, new index: ${queue.currentIndex}`,
    );
    return queue;
  }

  async previousTrack(userId: string): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    if (queue.tracks.length === 0) {
      return queue;
    }

    if (queue.shuffle) {
      // Random previous track (excluding current)
      const availableIndices = queue.tracks
        .map((_, index) => index)
        .filter((index) => index !== queue.currentIndex);

      if (availableIndices.length > 0) {
        queue.currentIndex =
          availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
    } else {
      queue.currentIndex--;

      if (queue.currentIndex < 0) {
        if (queue.repeat === 'all') {
          queue.currentIndex = queue.tracks.length - 1;
        } else {
          queue.currentIndex = 0;
        }
      }
    }

    queue.updatedAt = new Date();
    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(
      `Previous track for user ${userId}, new index: ${queue.currentIndex}`,
    );
    return queue;
  }

  async togglePlayPause(userId: string): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    queue.isPlaying = !queue.isPlaying;
    queue.updatedAt = new Date();

    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(
      `Play/pause toggled for user ${userId}: ${queue.isPlaying}`,
    );
    return queue;
  }

  async setVolume(userId: string, volume: number): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    queue.volume = Math.max(0, Math.min(1, volume));
    queue.updatedAt = new Date();

    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(`Volume set to ${queue.volume} for user ${userId}`);
    return queue;
  }

  async setRepeat(
    userId: string,
    repeat: 'none' | 'one' | 'all',
  ): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    queue.repeat = repeat;
    queue.updatedAt = new Date();

    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(`Repeat mode set to ${repeat} for user ${userId}`);
    return queue;
  }

  async setShuffle(userId: string, shuffle: boolean): Promise<UserQueue> {
    const queue = await this.getQueue(userId);

    queue.shuffle = shuffle;
    queue.updatedAt = new Date();

    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(`Shuffle mode set to ${shuffle} for user ${userId}`);
    return queue;
  }

  async addPlaylist(userId: string, playlistId: string): Promise<UserQueue> {
    // This would require importing PlaylistsService, so for now we'll skip the full implementation
    // In a real app, you'd populate the playlist tracks and add them to the queue
    this.logger.log(
      `Playlist ${playlistId} addition requested for user ${userId}`,
    );
    return this.getQueue(userId);
  }

  async addAlbum(userId: string, albumId: string): Promise<UserQueue> {
    const tracks = await this.trackRepository.findByAlbum(albumId);
    const queue = await this.getQueue(userId);

    for (const track of tracks) {
      // Check if track already exists
      const existingIndex = queue.tracks.findIndex((t) => t.id === track.id);
      if (existingIndex === -1) {
        const queueTrack: QueueTrack = {
          id: track.id,
          track,
          addedAt: new Date(),
          addedBy: userId,
          order: queue.tracks.length,
        };
        queue.tracks.push(queueTrack);
      }
    }

    queue.updatedAt = new Date();
    this.userQueues.set(userId, queue);
    await this.saveQueueToDatabase(queue);

    this.logger.log(`Album ${albumId} added to queue for user ${userId}`);
    return queue;
  }

  private async saveQueueToDatabase(queue: UserQueue): Promise<void> {
    try {
      await this.streamQueueRepository.createOrUpdateUserQueue(queue.userId, {
        tracks: queue.tracks.map((t) => t.id),
        currentIndex: queue.currentIndex,
        isShuffled: queue.shuffle,
        repeatMode: queue.repeat,
      });
    } catch (error) {
      this.logger.error('Failed to save queue to database:', error);
    }
  }

  private mapStreamQueueToUserQueue(streamQueue: any): UserQueue {
    return {
      userId: streamQueue.userId,
      tracks: streamQueue.tracks.map((item: any) => ({
        id: item.track.id,
        track: item.track,
        addedAt: item.addedAt,
        addedBy: item.addedBy,
        order: item.order,
      })),
      currentIndex: streamQueue.currentIndex || 0,
      isPlaying: streamQueue.isPlaying || false,
      volume: streamQueue.volume || 1.0,
      repeat: streamQueue.repeatMode || 'none',
      shuffle: streamQueue.shuffle || false,
      updatedAt: streamQueue.updatedAt || new Date(),
    };
  }

  getCurrentTrack(userId: string): QueueTrack | null {
    const queue = this.userQueues.get(userId);
    if (
      !queue ||
      queue.tracks.length === 0 ||
      queue.currentIndex >= queue.tracks.length
    ) {
      return null;
    }
    return queue.tracks[queue.currentIndex];
  }

  getQueueSize(userId: string): number {
    const queue = this.userQueues.get(userId);
    return queue ? queue.tracks.length : 0;
  }
}

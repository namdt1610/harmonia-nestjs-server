import { Model } from 'mongoose';
import { StreamQueue } from '../schemas/stream-queue.schema';
import { Track } from '../schemas/track.schema';
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
export declare class StreamQueueService {
    private streamQueueModel;
    private trackModel;
    private readonly logger;
    private userQueues;
    constructor(streamQueueModel: Model<StreamQueue>, trackModel: Model<Track>);
    getQueue(userId: string): Promise<UserQueue>;
    addTrack(userId: string, trackId: string, position?: number): Promise<UserQueue>;
    removeTrack(userId: string, trackIndex: number): Promise<UserQueue>;
    moveTrack(userId: string, fromIndex: number, toIndex: number): Promise<UserQueue>;
    clearQueue(userId: string): Promise<UserQueue>;
    setCurrentTrack(userId: string, trackIndex: number): Promise<UserQueue>;
    nextTrack(userId: string): Promise<UserQueue>;
    previousTrack(userId: string): Promise<UserQueue>;
    togglePlayPause(userId: string): Promise<UserQueue>;
    setVolume(userId: string, volume: number): Promise<UserQueue>;
    setRepeat(userId: string, repeat: 'none' | 'one' | 'all'): Promise<UserQueue>;
    setShuffle(userId: string, shuffle: boolean): Promise<UserQueue>;
    addPlaylist(userId: string, playlistId: string): Promise<UserQueue>;
    addAlbum(userId: string, albumId: string): Promise<UserQueue>;
    private saveQueueToDatabase;
    getCurrentTrack(userId: string): QueueTrack | null;
    getQueueSize(userId: string): number;
}

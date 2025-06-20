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
                image?: string;
            };
        };
    })[];
};
export declare class StreamQueueRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createStreamQueueDto: CreateStreamQueueDto): Promise<StreamQueue>;
    findAll(page?: number, limit?: number, filters?: {
        userId?: string;
    }): Promise<{
        queues: StreamQueueWithRelations[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<StreamQueueWithRelations | null>;
    findByUser(userId: string): Promise<StreamQueueWithRelations | null>;
    createOrUpdateUserQueue(userId: string, updateData: UpdateStreamQueueDto): Promise<StreamQueue>;
    update(id: string, updateStreamQueueDto: UpdateStreamQueueDto): Promise<StreamQueueWithRelations | null>;
    delete(id: string): Promise<boolean>;
    addTrack(userId: string, trackId: string, position?: number): Promise<StreamQueueWithRelations | null>;
    removeTrack(userId: string, trackId: string): Promise<StreamQueueWithRelations | null>;
    clearQueue(userId: string): Promise<StreamQueueWithRelations | null>;
    setCurrentTrack(userId: string, trackIndex: number): Promise<StreamQueueWithRelations | null>;
    nextTrack(userId: string): Promise<StreamQueueWithRelations | null>;
    previousTrack(userId: string): Promise<StreamQueueWithRelations | null>;
    toggleShuffle(userId: string): Promise<StreamQueueWithRelations | null>;
    setRepeatMode(userId: string, repeatMode: 'off' | 'track' | 'playlist'): Promise<StreamQueueWithRelations | null>;
    getCurrentTrack(userId: string): Promise<any | null>;
    getQueueStatistics(): Promise<{
        totalQueues: number;
        queuesWithTracks: number;
        averageTracksPerQueue: number;
        totalTracks: number;
        shuffleModeCount: number;
        repeatModeStats: Record<string, number>;
    }>;
    private getIncludeOptions;
}
export {};

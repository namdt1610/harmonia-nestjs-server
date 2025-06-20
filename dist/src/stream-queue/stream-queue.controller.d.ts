import { StreamQueueService } from './stream-queue.service';
declare class AddTrackDto {
    trackId: string;
    position?: number;
}
declare class MoveTrackDto {
    fromIndex: number;
    toIndex: number;
}
declare class SetVolumeDto {
    volume: number;
}
declare class SetRepeatDto {
    repeat: 'none' | 'one' | 'all';
}
declare class SetShuffleDto {
    shuffle: boolean;
}
export declare class StreamQueueController {
    private readonly streamQueueService;
    constructor(streamQueueService: StreamQueueService);
    getQueue(req: any): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
    }>;
    getCurrentTrack(req: any): Promise<{
        success: boolean;
        data: import("./stream-queue.service").QueueTrack | null;
    }>;
    getQueueSize(req: any): Promise<{
        success: boolean;
        data: {
            size: number;
        };
    }>;
    addTrack(req: any, addTrackDto: AddTrackDto): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    removeTrack(req: any, index: string): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    moveTrack(req: any, moveTrackDto: MoveTrackDto): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    clearQueue(req: any): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    }>;
    setCurrentTrack(req: any, index: string): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    nextTrack(req: any): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    }>;
    previousTrack(req: any): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    }>;
    togglePlayPause(req: any): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    }>;
    setVolume(req: any, setVolumeDto: SetVolumeDto): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    }>;
    setRepeat(req: any, setRepeatDto: SetRepeatDto): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    }>;
    setShuffle(req: any, setShuffleDto: SetShuffleDto): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    }>;
    addAlbum(req: any, albumId: string): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    addPlaylist(req: any, playlistId: string): Promise<{
        success: boolean;
        data: import("./stream-queue.service").UserQueue;
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
export {};

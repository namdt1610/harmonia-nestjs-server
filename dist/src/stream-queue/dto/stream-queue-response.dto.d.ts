declare class UserInfo {
    id: string;
    username: string;
    email: string;
}
declare class TrackInfo {
    id: string;
    title: string;
    duration: number;
    audioFileUrl: string;
    artist: any;
    album: any;
}
export declare class StreamQueueResponseDto {
    id: string;
    user: UserInfo;
    tracks: TrackInfo[];
    currentIndex: number;
    shuffle: boolean;
    repeat: string;
    lastPlayed: Date;
    createdAt: Date;
    updatedAt: Date;
    currentTrack?: TrackInfo;
    nextTrack?: TrackInfo;
    totalTracks: number;
    totalDuration: number;
}
export {};

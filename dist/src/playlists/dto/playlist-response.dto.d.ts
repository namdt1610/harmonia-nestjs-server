declare class UserBasicInfo {
    id: string;
    username: string;
    image?: string;
}
declare class TrackBasicInfo {
    id: string;
    title: string;
    duration?: number;
    image?: string;
    artist?: {
        id: string;
        name: string;
        image?: string;
    };
}
export declare class PlaylistResponseDto {
    id: string;
    name: string;
    isPublic: boolean;
    followers: number;
    description?: string;
    image?: string;
    user: UserBasicInfo;
    tracks?: TrackBasicInfo[];
    trackCount?: number;
    totalDuration?: number;
    createdAt: Date;
    updatedAt: Date;
}
export {};

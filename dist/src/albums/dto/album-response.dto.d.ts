declare class ArtistBasicInfo {
    id: string;
    name: string;
    image?: string;
}
declare class TrackBasicInfo {
    id: string;
    title: string;
    duration?: number;
    playCount?: number;
}
export declare class AlbumResponseDto {
    id: string;
    title: string;
    image?: string;
    releaseDate?: Date;
    description?: string;
    artist: ArtistBasicInfo;
    tracks?: TrackBasicInfo[];
    trackCount?: number;
    totalDuration?: number;
    totalPlays?: number;
    createdAt: Date;
    updatedAt: Date;
}
export {};

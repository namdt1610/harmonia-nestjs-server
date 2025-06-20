declare class TrackBasicInfo {
    id: string;
    title: string;
    image?: string;
    duration?: number;
}
declare class AlbumBasicInfo {
    id: string;
    title: string;
    image?: string;
    releaseDate?: Date;
}
export declare class ArtistResponseDto {
    id: string;
    name: string;
    bio?: string;
    image?: string;
    tracks?: TrackBasicInfo[];
    albums?: AlbumBasicInfo[];
    trackCount?: number;
    albumCount?: number;
    totalPlays?: number;
    createdAt: Date;
    updatedAt: Date;
}
export {};

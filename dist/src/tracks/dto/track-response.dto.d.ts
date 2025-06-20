declare class ArtistBasicInfo {
    id: string;
    name: string;
    image?: string;
}
declare class AlbumBasicInfo {
    id: string;
    title: string;
    image?: string;
}
declare class GenreBasicInfo {
    id: string;
    name: string;
}
export declare class TrackResponseDto {
    id: string;
    title: string;
    file?: string;
    video?: string;
    image?: string;
    videoThumbnail?: string;
    duration?: number;
    lyrics?: string;
    playCount: number;
    downloadCount: number;
    isDownloadable: boolean;
    artist: ArtistBasicInfo;
    album?: AlbumBasicInfo;
    genres?: GenreBasicInfo[];
    createdAt: Date;
    updatedAt: Date;
}
export {};

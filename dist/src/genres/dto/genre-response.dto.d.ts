declare class TrackBasicInfo {
    id: string;
    title: string;
    image?: string;
    artist?: {
        id: string;
        name: string;
        image?: string;
    };
}
export declare class GenreResponseDto {
    id: string;
    name: string;
    description?: string;
    tracks?: TrackBasicInfo[];
    trackCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
export {};

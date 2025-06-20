import { FavoriteType } from '../../schemas/favorite.schema';
declare class UserInfo {
    id: string;
    username: string;
    email: string;
}
declare class TrackInfo {
    id: string;
    title: string;
    duration: number;
}
declare class ArtistInfo {
    id: string;
    name: string;
    image: string;
}
declare class AlbumInfo {
    id: string;
    title: string;
    image: string;
}
declare class PlaylistInfo {
    id: string;
    name: string;
    isPublic: boolean;
}
export declare class FavoriteResponseDto {
    id: string;
    user: UserInfo;
    type: FavoriteType;
    itemId: string;
    item?: TrackInfo | ArtistInfo | AlbumInfo | PlaylistInfo;
    addedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export {};

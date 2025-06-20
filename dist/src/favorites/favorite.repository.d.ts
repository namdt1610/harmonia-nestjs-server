import { Model } from 'mongoose';
import { Favorite, FavoriteDocument, FavoriteType } from '../schemas/favorite.schema';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
export declare class FavoriteRepository {
    private favoriteModel;
    constructor(favoriteModel: Model<FavoriteDocument>);
    create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite>;
    findAll(page?: number, limit?: number, filters?: {
        userId?: string;
        type?: FavoriteType;
    }): Promise<{
        favorites: Favorite[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<Favorite | null>;
    findByUser(userId: string, type?: FavoriteType, page?: number, limit?: number): Promise<{
        favorites: Favorite[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findUserFavoritesByType(userId: string, type: FavoriteType): Promise<Favorite[]>;
    findUserFavoriteTracks(userId: string): Promise<Favorite[]>;
    findUserFavoriteArtists(userId: string): Promise<Favorite[]>;
    findUserFavoriteAlbums(userId: string): Promise<Favorite[]>;
    findUserFavoritePlaylists(userId: string): Promise<Favorite[]>;
    isItemFavorited(userId: string, itemId: string, type: FavoriteType): Promise<boolean>;
    addToFavorites(userId: string, itemId: string, type: FavoriteType): Promise<Favorite | null>;
    removeFromFavorites(userId: string, itemId: string, type: FavoriteType): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    getUserFavoriteCount(userId: string): Promise<number>;
    getUserFavoriteCountsByType(userId: string): Promise<{
        tracks: number;
        artists: number;
        albums: number;
        playlists: number;
        total: number;
    }>;
    getMostFavoritedItems(type: FavoriteType, limit?: number): Promise<{
        itemId: string;
        count: number;
    }[]>;
    getStatistics(): Promise<{
        totalFavorites: number;
        favoritesByType: Record<FavoriteType, number>;
        uniqueUsers: number;
        averageFavoritesPerUser: number;
    }>;
    clearUserFavorites(userId: string): Promise<boolean>;
}

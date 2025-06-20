import { PrismaService } from '../common/prisma.service';
import { User, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        playlists: true;
        favoriteTracks: {
            include: {
                track: true;
            };
        };
        favoriteArtists: {
            include: {
                artist: true;
            };
        };
        favoriteAlbums: {
            include: {
                album: true;
            };
        };
        subscription: {
            include: {
                plan: true;
            };
        };
        activities: true;
        recentlyPlayed: {
            include: {
                track: true;
            };
        };
        streamQueues: {
            include: {
                tracks: {
                    include: {
                        track: true;
                    };
                };
            };
        };
    };
}>;
export declare class UserRepository extends BaseRepository<User> {
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByGoogleSub(googleSub: string): Promise<User | null>;
    findWithRelations(id: string): Promise<UserWithRelations | null>;
    findAllWithPagination(page?: number, limit?: number, filters?: {
        isActive?: boolean;
        isStaff?: boolean;
        search?: string;
    }): Promise<{
        users: User[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updateLastLogin(id: string): Promise<User | null>;
    addToFavorites(userId: string, itemType: 'track' | 'artist' | 'album', itemId: string): Promise<boolean>;
    removeFromFavorites(userId: string, itemType: 'track' | 'artist' | 'album', itemId: string): Promise<boolean>;
    addRecentlyPlayed(userId: string, trackId: string): Promise<void>;
    getRecentlyPlayed(userId: string, limit?: number): Promise<any[]>;
    getFavorites(userId: string, type?: 'track' | 'artist' | 'album'): Promise<any>;
    getUserStats(userId: string): Promise<any>;
}
export {};

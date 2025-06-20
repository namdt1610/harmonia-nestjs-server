"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const base_repository_1 = require("../common/base.repository");
let UserRepository = class UserRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'user');
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }
    async findByGoogleSub(googleSub) {
        return this.prisma.user.findFirst({
            where: { googleSub },
        });
    }
    async findWithRelations(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                playlists: true,
                favoriteTracks: { include: { track: true } },
                favoriteArtists: { include: { artist: true } },
                favoriteAlbums: { include: { album: true } },
                subscription: { include: { plan: true } },
                activities: { orderBy: { createdAt: 'desc' }, take: 10 },
                recentlyPlayed: {
                    include: { track: true },
                    orderBy: { playedAt: 'desc' },
                    take: 10,
                },
                streamQueues: {
                    include: {
                        tracks: {
                            include: { track: true },
                            orderBy: { position: 'asc' },
                        },
                    },
                },
            },
        });
    }
    async findAllWithPagination(page = 1, limit = 10, filters = {}) {
        const where = {};
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.isStaff !== undefined) {
            where.isStaff = filters.isStaff;
        }
        if (filters.search) {
            where.OR = [
                { username: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { firstName: { contains: filters.search, mode: 'insensitive' } },
                { lastName: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async updateLastLogin(id) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: { lastLogin: new Date() },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async addToFavorites(userId, itemType, itemId) {
        try {
            switch (itemType) {
                case 'track':
                    await this.prisma.userFavoriteTrack.create({
                        data: { userId, trackId: itemId },
                    });
                    break;
                case 'artist':
                    await this.prisma.userFavoriteArtist.create({
                        data: { userId, artistId: itemId },
                    });
                    break;
                case 'album':
                    await this.prisma.userFavoriteAlbum.create({
                        data: { userId, albumId: itemId },
                    });
                    break;
            }
            return true;
        }
        catch (error) {
            if (error.code === 'P2002') {
                return false;
            }
            throw error;
        }
    }
    async removeFromFavorites(userId, itemType, itemId) {
        try {
            switch (itemType) {
                case 'track':
                    await this.prisma.userFavoriteTrack.delete({
                        where: { userId_trackId: { userId, trackId: itemId } },
                    });
                    break;
                case 'artist':
                    await this.prisma.userFavoriteArtist.delete({
                        where: { userId_artistId: { userId, artistId: itemId } },
                    });
                    break;
                case 'album':
                    await this.prisma.userFavoriteAlbum.delete({
                        where: { userId_albumId: { userId, albumId: itemId } },
                    });
                    break;
            }
            return true;
        }
        catch (error) {
            if (error.code === 'P2025') {
                return false;
            }
            throw error;
        }
    }
    async addRecentlyPlayed(userId, trackId) {
        await this.prisma.userRecentTrack.upsert({
            where: { userId_trackId: { userId, trackId } },
            update: { playedAt: new Date() },
            create: { userId, trackId, playedAt: new Date() },
        });
        const recentTracks = await this.prisma.userRecentTrack.findMany({
            where: { userId },
            orderBy: { playedAt: 'desc' },
            skip: 50,
        });
        if (recentTracks.length > 0) {
            await this.prisma.userRecentTrack.deleteMany({
                where: {
                    userId,
                    trackId: { in: recentTracks.map((track) => track.trackId) },
                },
            });
        }
    }
    async getRecentlyPlayed(userId, limit = 10) {
        const recentTracks = await this.prisma.userRecentTrack.findMany({
            where: { userId },
            include: {
                track: {
                    include: {
                        artist: true,
                        album: true,
                    },
                },
            },
            orderBy: { playedAt: 'desc' },
            take: limit,
        });
        return recentTracks.map((rt) => ({
            ...rt.track,
            playedAt: rt.playedAt,
        }));
    }
    async getFavorites(userId, type) {
        if (type === 'track') {
            return this.prisma.userFavoriteTrack.findMany({
                where: { userId },
                include: {
                    track: {
                        include: { artist: true, album: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (type === 'artist') {
            return this.prisma.userFavoriteArtist.findMany({
                where: { userId },
                include: { artist: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (type === 'album') {
            return this.prisma.userFavoriteAlbum.findMany({
                where: { userId },
                include: {
                    album: {
                        include: { artist: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        const [tracks, artists, albums] = await Promise.all([
            this.getFavorites(userId, 'track'),
            this.getFavorites(userId, 'artist'),
            this.getFavorites(userId, 'album'),
        ]);
        return { tracks, artists, albums };
    }
    async getUserStats(userId) {
        const [totalPlaylists, totalFavoriteTracks, totalFavoriteArtists, totalFavoriteAlbums, totalActivities,] = await Promise.all([
            this.prisma.playlist.count({ where: { userId } }),
            this.prisma.userFavoriteTrack.count({ where: { userId } }),
            this.prisma.userFavoriteArtist.count({ where: { userId } }),
            this.prisma.userFavoriteAlbum.count({ where: { userId } }),
            this.prisma.userActivity.count({ where: { userId } }),
        ]);
        return {
            totalPlaylists,
            totalFavoriteTracks,
            totalFavoriteArtists,
            totalFavoriteAlbums,
            totalActivities,
        };
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map
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
exports.ArtistRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const base_repository_1 = require("../common/base.repository");
let ArtistRepository = class ArtistRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'artist');
    }
    async create(createArtistDto) {
        return this.prisma.artist.create({
            data: createArtistDto,
        });
    }
    async findAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { bio: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [artists, total] = await Promise.all([
            this.prisma.artist.findMany({
                where,
                skip,
                take: limit,
                include: {
                    tracks: {
                        select: {
                            id: true,
                            title: true,
                            image: true,
                            duration: true,
                            playCount: true,
                        },
                        take: 5,
                        orderBy: { playCount: 'desc' },
                    },
                    albums: {
                        select: { id: true, title: true, image: true, releaseDate: true },
                        take: 5,
                        orderBy: { releaseDate: 'desc' },
                    },
                },
                orderBy: { name: 'asc' },
            }),
            this.prisma.artist.count({ where }),
        ]);
        return {
            artists,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        return this.prisma.artist.findUnique({
            where: { id },
            include: {
                tracks: {
                    orderBy: { playCount: 'desc' },
                    take: 10,
                },
                albums: {
                    orderBy: { releaseDate: 'desc' },
                },
                followers: {
                    include: { user: true },
                    take: 10,
                },
            },
        });
    }
    async findByName(name) {
        return this.prisma.artist.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });
    }
    async findByIds(ids) {
        return this.prisma.artist.findMany({
            where: { id: { in: ids } },
            include: {
                tracks: {
                    select: { id: true, title: true, image: true, duration: true },
                    take: 5,
                },
                albums: {
                    select: { id: true, title: true, image: true, releaseDate: true },
                    take: 5,
                },
            },
        });
    }
    async findPopular(limit = 10) {
        const artists = await this.prisma.artist.findMany({
            include: {
                tracks: {
                    select: { playCount: true },
                },
                albums: {
                    select: { id: true, title: true, image: true, releaseDate: true },
                    take: 3,
                },
            },
            take: limit * 2,
        });
        const artistsWithPlays = artists.map((artist) => ({
            ...artist,
            totalPlays: artist.tracks.reduce((sum, track) => sum + (track.playCount || 0), 0),
        }));
        return artistsWithPlays
            .sort((a, b) => b.totalPlays - a.totalPlays)
            .slice(0, limit);
    }
    async findRecent(limit = 10) {
        return this.prisma.artist.findMany({
            include: {
                tracks: {
                    select: { id: true, title: true, image: true, duration: true },
                    take: 3,
                },
                albums: {
                    select: { id: true, title: true, image: true, releaseDate: true },
                    take: 3,
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async update(id, updateArtistDto) {
        try {
            return await this.prisma.artist.update({
                where: { id },
                data: updateArtistDto,
                include: {
                    tracks: {
                        select: { id: true, title: true, image: true, duration: true },
                        take: 5,
                    },
                    albums: {
                        select: { id: true, title: true, image: true, releaseDate: true },
                        take: 5,
                    },
                },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async delete(id) {
        try {
            return await this.prisma.artist.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async search(query, limit = 20) {
        return this.prisma.artist.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { bio: { contains: query, mode: 'insensitive' } },
                ],
            },
            include: {
                tracks: {
                    select: { id: true, title: true, image: true, duration: true },
                    take: 3,
                },
                albums: {
                    select: { id: true, title: true, image: true, releaseDate: true },
                    take: 3,
                },
            },
            take: limit,
            orderBy: { name: 'asc' },
        });
    }
    async getArtistStats(artistId) {
        const [totalTracks, totalAlbums, totalFollowers, totalPlays] = await Promise.all([
            this.prisma.track.count({ where: { artistId } }),
            this.prisma.album.count({ where: { artistId } }),
            this.prisma.userFavoriteArtist.count({ where: { artistId } }),
            this.prisma.track.aggregate({
                where: { artistId },
                _sum: { playCount: true },
            }),
        ]);
        return {
            totalTracks,
            totalAlbums,
            totalFollowers,
            totalPlays: totalPlays._sum.playCount || 0,
        };
    }
    async getTopTracks(artistId, limit = 10) {
        return this.prisma.track.findMany({
            where: { artistId },
            include: {
                album: true,
                genres: { include: { genre: true } },
            },
            orderBy: { playCount: 'desc' },
            take: limit,
        });
    }
    async getAlbums(artistId) {
        return this.prisma.album.findMany({
            where: { artistId },
            include: {
                tracks: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { releaseDate: 'desc' },
        });
    }
    async addFollower(artistId, userId) {
        try {
            await this.prisma.userFavoriteArtist.create({
                data: { artistId, userId },
            });
            return true;
        }
        catch (error) {
            if (error.code === 'P2002') {
                return false;
            }
            throw error;
        }
    }
    async removeFollower(artistId, userId) {
        try {
            await this.prisma.userFavoriteArtist.delete({
                where: { userId_artistId: { userId, artistId } },
            });
            return true;
        }
        catch (error) {
            if (error.code === 'P2025') {
                return false;
            }
            throw error;
        }
    }
    async isFollowing(artistId, userId) {
        const follow = await this.prisma.userFavoriteArtist.findUnique({
            where: { userId_artistId: { userId, artistId } },
        });
        return !!follow;
    }
    async getFollowers(artistId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [followers, total] = await Promise.all([
            this.prisma.userFavoriteArtist.findMany({
                where: { artistId },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            image: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.userFavoriteArtist.count({ where: { artistId } }),
        ]);
        return {
            followers,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
};
exports.ArtistRepository = ArtistRepository;
exports.ArtistRepository = ArtistRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArtistRepository);
//# sourceMappingURL=artist.repository.js.map
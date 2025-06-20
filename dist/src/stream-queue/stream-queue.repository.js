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
exports.StreamQueueRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let StreamQueueRepository = class StreamQueueRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStreamQueueDto) {
        const { tracks = [], ...queueData } = createStreamQueueDto;
        return await this.prisma.streamQueue.create({
            data: {
                ...queueData,
                userId: queueData.user,
                tracks: {
                    create: tracks.map((trackId, index) => ({
                        trackId: trackId,
                        position: index,
                    })),
                },
            },
            include: this.getIncludeOptions(),
        });
    }
    async findAll(page = 1, limit = 10, filters = {}) {
        const where = {};
        if (filters.userId) {
            where.userId = filters.userId;
        }
        const skip = (page - 1) * limit;
        const [queues, total] = await Promise.all([
            this.prisma.streamQueue.findMany({
                where,
                skip,
                take: limit,
                orderBy: { lastPlayed: 'desc' },
                include: this.getIncludeOptions(),
            }),
            this.prisma.streamQueue.count({ where }),
        ]);
        return {
            queues,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        return await this.prisma.streamQueue.findUnique({
            where: { id },
            include: this.getIncludeOptions(),
        });
    }
    async findByUser(userId) {
        return await this.prisma.streamQueue.findUnique({
            where: { userId },
            include: this.getIncludeOptions(),
        });
    }
    async createOrUpdateUserQueue(userId, updateData) {
        const existingQueue = await this.findByUser(userId);
        if (existingQueue) {
            const updated = await this.update(existingQueue.id, updateData);
            if (!updated) {
                throw new Error('Failed to update queue');
            }
            return updated;
        }
        else {
            const createDto = {
                user: userId,
                ...updateData,
            };
            return await this.create(createDto);
        }
    }
    async update(id, updateStreamQueueDto) {
        try {
            const { tracks, ...updateData } = updateStreamQueueDto;
            return await this.prisma.streamQueue.update({
                where: { id },
                data: {
                    ...updateData,
                    lastPlayed: new Date(),
                    ...(tracks && {
                        tracks: {
                            deleteMany: {},
                            create: tracks.map((trackId, index) => ({
                                trackId: trackId,
                                position: index,
                            })),
                        },
                    }),
                },
                include: this.getIncludeOptions(),
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
            await this.prisma.streamQueue.delete({ where: { id } });
            return true;
        }
        catch (error) {
            if (error.code === 'P2025') {
                return false;
            }
            throw error;
        }
    }
    async addTrack(userId, trackId, position) {
        const queue = await this.findByUser(userId);
        if (!queue) {
            return await this.create({
                user: userId,
                tracks: [trackId],
                currentIndex: 0,
            });
        }
        const existingTrack = queue.tracks.find((t) => t.trackId === trackId);
        if (existingTrack) {
            return queue;
        }
        const maxPosition = Math.max(...queue.tracks.map((t) => t.position), -1);
        const newPosition = position !== undefined && position >= 0 && position <= maxPosition + 1
            ? position
            : maxPosition + 1;
        if (position !== undefined && position <= maxPosition) {
            await this.prisma.streamQueueTrack.updateMany({
                where: {
                    queueId: queue.id,
                    position: { gte: position },
                },
                data: {
                    position: { increment: 1 },
                },
            });
        }
        await this.prisma.streamQueueTrack.create({
            data: {
                queueId: queue.id,
                trackId,
                position: newPosition,
            },
        });
        return await this.findById(queue.id);
    }
    async removeTrack(userId, trackId) {
        const queue = await this.findByUser(userId);
        if (!queue) {
            return null;
        }
        const trackToRemove = queue.tracks.find((t) => t.trackId === trackId);
        if (!trackToRemove) {
            return queue;
        }
        await this.prisma.streamQueueTrack.delete({
            where: {
                queueId_trackId: {
                    queueId: queue.id,
                    trackId,
                },
            },
        });
        await this.prisma.streamQueueTrack.updateMany({
            where: {
                queueId: queue.id,
                position: { gt: trackToRemove.position },
            },
            data: {
                position: { decrement: 1 },
            },
        });
        let newCurrentIndex = queue.currentIndex;
        if (trackToRemove.position < queue.currentIndex) {
            newCurrentIndex = Math.max(0, queue.currentIndex - 1);
        }
        else if (trackToRemove.position === queue.currentIndex) {
            newCurrentIndex = Math.min(queue.currentIndex, queue.tracks.length - 2);
        }
        await this.prisma.streamQueue.update({
            where: { id: queue.id },
            data: { currentIndex: newCurrentIndex },
        });
        return await this.findById(queue.id);
    }
    async clearQueue(userId) {
        const queue = await this.findByUser(userId);
        if (!queue) {
            return null;
        }
        await this.prisma.streamQueueTrack.deleteMany({
            where: { queueId: queue.id },
        });
        return await this.prisma.streamQueue.update({
            where: { id: queue.id },
            data: { currentIndex: 0 },
            include: this.getIncludeOptions(),
        });
    }
    async setCurrentTrack(userId, trackIndex) {
        const queue = await this.findByUser(userId);
        if (!queue) {
            return null;
        }
        if (trackIndex < 0 || trackIndex >= queue.tracks.length) {
            return queue;
        }
        return await this.prisma.streamQueue.update({
            where: { id: queue.id },
            data: {
                currentIndex: trackIndex,
                lastPlayed: new Date(),
            },
            include: this.getIncludeOptions(),
        });
    }
    async nextTrack(userId) {
        const queue = await this.findByUser(userId);
        if (!queue || queue.tracks.length === 0) {
            return queue;
        }
        let nextIndex = queue.currentIndex + 1;
        if (queue.repeat === 'track') {
            nextIndex = queue.currentIndex;
        }
        else if (nextIndex >= queue.tracks.length) {
            if (queue.repeat === 'playlist') {
                nextIndex = 0;
            }
            else {
                nextIndex = queue.tracks.length - 1;
            }
        }
        return await this.setCurrentTrack(userId, nextIndex);
    }
    async previousTrack(userId) {
        const queue = await this.findByUser(userId);
        if (!queue || queue.tracks.length === 0) {
            return queue;
        }
        let prevIndex = queue.currentIndex - 1;
        if (prevIndex < 0) {
            if (queue.repeat === 'playlist') {
                prevIndex = queue.tracks.length - 1;
            }
            else {
                prevIndex = 0;
            }
        }
        return await this.setCurrentTrack(userId, prevIndex);
    }
    async toggleShuffle(userId) {
        const queue = await this.findByUser(userId);
        if (!queue) {
            return null;
        }
        return await this.prisma.streamQueue.update({
            where: { id: queue.id },
            data: { shuffle: !queue.shuffle },
            include: this.getIncludeOptions(),
        });
    }
    async setRepeatMode(userId, repeatMode) {
        const queue = await this.findByUser(userId);
        if (!queue) {
            return null;
        }
        return await this.prisma.streamQueue.update({
            where: { id: queue.id },
            data: { repeat: repeatMode },
            include: this.getIncludeOptions(),
        });
    }
    async getCurrentTrack(userId) {
        const queue = await this.findByUser(userId);
        if (!queue || queue.tracks.length === 0) {
            return null;
        }
        const currentTrack = queue.tracks.find((t) => t.position === queue.currentIndex);
        return currentTrack?.track || null;
    }
    async getQueueStatistics() {
        const [totalQueues, queuesWithTracks, totalTracks, shuffleModeCount, repeatModeStats,] = await Promise.all([
            this.prisma.streamQueue.count(),
            this.prisma.streamQueue.count({
                where: { tracks: { some: {} } },
            }),
            this.prisma.streamQueueTrack.count(),
            this.prisma.streamQueue.count({
                where: { shuffle: true },
            }),
            this.prisma.streamQueue.groupBy({
                by: ['repeat'],
                _count: true,
            }),
        ]);
        const averageTracksPerQueue = totalQueues > 0 ? totalTracks / totalQueues : 0;
        const repeatStats = repeatModeStats.reduce((acc, stat) => {
            acc[stat.repeat] = stat._count;
            return acc;
        }, {});
        return {
            totalQueues,
            queuesWithTracks,
            averageTracksPerQueue: Math.round(averageTracksPerQueue * 100) / 100,
            totalTracks,
            shuffleModeCount,
            repeatModeStats: repeatStats,
        };
    }
    getIncludeOptions() {
        return {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            },
            tracks: {
                include: {
                    track: {
                        include: {
                            artist: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            album: {
                                select: {
                                    id: true,
                                    title: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    position: 'asc',
                },
            },
        };
    }
};
exports.StreamQueueRepository = StreamQueueRepository;
exports.StreamQueueRepository = StreamQueueRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StreamQueueRepository);
//# sourceMappingURL=stream-queue.repository.js.map
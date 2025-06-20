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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StreamQueueService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamQueueService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stream_queue_schema_1 = require("../schemas/stream-queue.schema");
const track_schema_1 = require("../schemas/track.schema");
let StreamQueueService = StreamQueueService_1 = class StreamQueueService {
    streamQueueModel;
    trackModel;
    logger = new common_1.Logger(StreamQueueService_1.name);
    userQueues = new Map();
    constructor(streamQueueModel, trackModel) {
        this.streamQueueModel = streamQueueModel;
        this.trackModel = trackModel;
    }
    async getQueue(userId) {
        let queue = this.userQueues.get(userId);
        if (!queue) {
            const savedQueue = await this.streamQueueModel
                .findOne({ user: userId })
                .populate('tracks');
            if (savedQueue) {
                queue = {
                    userId,
                    tracks: savedQueue.tracks.map((trackId, index) => ({
                        id: trackId.toString(),
                        track: trackId,
                        addedAt: new Date(),
                        addedBy: userId,
                        order: index,
                    })),
                    currentIndex: savedQueue.currentIndex || 0,
                    isPlaying: false,
                    volume: 1.0,
                    repeat: (savedQueue.repeat === 'track'
                        ? 'one'
                        : savedQueue.repeat === 'playlist'
                            ? 'all'
                            : 'none'),
                    shuffle: savedQueue.shuffle || false,
                    updatedAt: new Date(),
                };
            }
            else {
                queue = {
                    userId,
                    tracks: [],
                    currentIndex: 0,
                    isPlaying: false,
                    volume: 1.0,
                    repeat: 'none',
                    shuffle: false,
                    updatedAt: new Date(),
                };
            }
            this.userQueues.set(userId, queue);
        }
        return queue;
    }
    async addTrack(userId, trackId, position) {
        const track = await this.trackModel
            .findById(trackId)
            .populate('artist album');
        if (!track) {
            throw new Error('Track not found');
        }
        const queue = await this.getQueue(userId);
        const queueTrack = {
            id: trackId,
            track,
            addedAt: new Date(),
            addedBy: userId,
            order: position !== undefined ? position : queue.tracks.length,
        };
        if (position !== undefined && position < queue.tracks.length) {
            queue.tracks.splice(position, 0, queueTrack);
            queue.tracks.forEach((track, index) => {
                track.order = index;
            });
        }
        else {
            queue.tracks.push(queueTrack);
        }
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Track ${trackId} added to queue for user ${userId}`);
        return queue;
    }
    async removeTrack(userId, trackIndex) {
        const queue = await this.getQueue(userId);
        if (trackIndex < 0 || trackIndex >= queue.tracks.length) {
            throw new Error('Invalid track index');
        }
        queue.tracks.splice(trackIndex, 1);
        queue.tracks.forEach((track, index) => {
            track.order = index;
        });
        if (queue.currentIndex >= trackIndex) {
            queue.currentIndex = Math.max(0, queue.currentIndex - 1);
        }
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Track at index ${trackIndex} removed from queue for user ${userId}`);
        return queue;
    }
    async moveTrack(userId, fromIndex, toIndex) {
        const queue = await this.getQueue(userId);
        if (fromIndex < 0 ||
            fromIndex >= queue.tracks.length ||
            toIndex < 0 ||
            toIndex >= queue.tracks.length) {
            throw new Error('Invalid track indices');
        }
        const [movedTrack] = queue.tracks.splice(fromIndex, 1);
        queue.tracks.splice(toIndex, 0, movedTrack);
        queue.tracks.forEach((track, index) => {
            track.order = index;
        });
        if (queue.currentIndex === fromIndex) {
            queue.currentIndex = toIndex;
        }
        else if (queue.currentIndex > fromIndex &&
            queue.currentIndex <= toIndex) {
            queue.currentIndex--;
        }
        else if (queue.currentIndex < fromIndex &&
            queue.currentIndex >= toIndex) {
            queue.currentIndex++;
        }
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Track moved from index ${fromIndex} to ${toIndex} for user ${userId}`);
        return queue;
    }
    async clearQueue(userId) {
        const queue = await this.getQueue(userId);
        queue.tracks = [];
        queue.currentIndex = 0;
        queue.isPlaying = false;
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Queue cleared for user ${userId}`);
        return queue;
    }
    async setCurrentTrack(userId, trackIndex) {
        const queue = await this.getQueue(userId);
        if (trackIndex < 0 || trackIndex >= queue.tracks.length) {
            throw new Error('Invalid track index');
        }
        queue.currentIndex = trackIndex;
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Current track set to index ${trackIndex} for user ${userId}`);
        return queue;
    }
    async nextTrack(userId) {
        const queue = await this.getQueue(userId);
        if (queue.tracks.length === 0) {
            return queue;
        }
        if (queue.repeat === 'one') {
            return queue;
        }
        if (queue.shuffle) {
            const availableIndices = queue.tracks
                .map((_, index) => index)
                .filter((index) => index !== queue.currentIndex);
            if (availableIndices.length > 0) {
                queue.currentIndex =
                    availableIndices[Math.floor(Math.random() * availableIndices.length)];
            }
        }
        else {
            queue.currentIndex++;
            if (queue.currentIndex >= queue.tracks.length) {
                if (queue.repeat === 'all') {
                    queue.currentIndex = 0;
                }
                else {
                    queue.currentIndex = queue.tracks.length - 1;
                    queue.isPlaying = false;
                }
            }
        }
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Next track for user ${userId}, new index: ${queue.currentIndex}`);
        return queue;
    }
    async previousTrack(userId) {
        const queue = await this.getQueue(userId);
        if (queue.tracks.length === 0) {
            return queue;
        }
        if (queue.shuffle) {
            const availableIndices = queue.tracks
                .map((_, index) => index)
                .filter((index) => index !== queue.currentIndex);
            if (availableIndices.length > 0) {
                queue.currentIndex =
                    availableIndices[Math.floor(Math.random() * availableIndices.length)];
            }
        }
        else {
            queue.currentIndex--;
            if (queue.currentIndex < 0) {
                if (queue.repeat === 'all') {
                    queue.currentIndex = queue.tracks.length - 1;
                }
                else {
                    queue.currentIndex = 0;
                }
            }
        }
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Previous track for user ${userId}, new index: ${queue.currentIndex}`);
        return queue;
    }
    async togglePlayPause(userId) {
        const queue = await this.getQueue(userId);
        queue.isPlaying = !queue.isPlaying;
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Play/pause toggled for user ${userId}: ${queue.isPlaying}`);
        return queue;
    }
    async setVolume(userId, volume) {
        const queue = await this.getQueue(userId);
        queue.volume = Math.max(0, Math.min(1, volume));
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Volume set to ${queue.volume} for user ${userId}`);
        return queue;
    }
    async setRepeat(userId, repeat) {
        const queue = await this.getQueue(userId);
        queue.repeat = repeat;
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Repeat mode set to ${repeat} for user ${userId}`);
        return queue;
    }
    async setShuffle(userId, shuffle) {
        const queue = await this.getQueue(userId);
        queue.shuffle = shuffle;
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Shuffle mode set to ${shuffle} for user ${userId}`);
        return queue;
    }
    async addPlaylist(userId, playlistId) {
        this.logger.log(`Playlist ${playlistId} addition requested for user ${userId}`);
        return this.getQueue(userId);
    }
    async addAlbum(userId, albumId) {
        const tracks = await this.trackModel
            .find({ album: albumId })
            .populate('artist album');
        const queue = await this.getQueue(userId);
        for (const track of tracks) {
            const queueTrack = {
                id: track._id.toString(),
                track,
                addedAt: new Date(),
                addedBy: userId,
                order: queue.tracks.length,
            };
            queue.tracks.push(queueTrack);
        }
        queue.updatedAt = new Date();
        this.userQueues.set(userId, queue);
        await this.saveQueueToDatabase(queue);
        this.logger.log(`Album ${albumId} added to queue for user ${userId}`);
        return queue;
    }
    async saveQueueToDatabase(queue) {
        try {
            await this.streamQueueModel.findOneAndUpdate({ userId: queue.userId }, {
                userId: queue.userId,
                tracks: queue.tracks.map((t) => ({
                    track: t.track._id || t.track,
                    addedAt: t.addedAt,
                    addedBy: t.addedBy,
                })),
                currentIndex: queue.currentIndex,
                isPlaying: queue.isPlaying,
                volume: queue.volume,
                repeat: queue.repeat,
                shuffle: queue.shuffle,
                updatedAt: queue.updatedAt,
            }, { upsert: true, new: true });
        }
        catch (error) {
            this.logger.error(`Failed to save queue to database for user ${queue.userId}:`, error);
        }
    }
    getCurrentTrack(userId) {
        const queue = this.userQueues.get(userId);
        if (!queue ||
            queue.tracks.length === 0 ||
            queue.currentIndex >= queue.tracks.length) {
            return null;
        }
        return queue.tracks[queue.currentIndex];
    }
    getQueueSize(userId) {
        const queue = this.userQueues.get(userId);
        return queue ? queue.tracks.length : 0;
    }
};
exports.StreamQueueService = StreamQueueService;
exports.StreamQueueService = StreamQueueService = StreamQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(stream_queue_schema_1.StreamQueue.name)),
    __param(1, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], StreamQueueService);
//# sourceMappingURL=stream-queue.service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamQueueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stream_queue_service_1 = require("./stream-queue.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
class AddTrackDto {
    trackId;
    position;
}
class MoveTrackDto {
    fromIndex;
    toIndex;
}
class SetVolumeDto {
    volume;
}
class SetRepeatDto {
    repeat;
}
class SetShuffleDto {
    shuffle;
}
let StreamQueueController = class StreamQueueController {
    streamQueueService;
    constructor(streamQueueService) {
        this.streamQueueService = streamQueueService;
    }
    async getQueue(req) {
        const queue = await this.streamQueueService.getQueue(req.user.sub);
        return {
            success: true,
            data: queue,
        };
    }
    async getCurrentTrack(req) {
        const currentTrack = this.streamQueueService.getCurrentTrack(req.user.sub);
        return {
            success: true,
            data: currentTrack,
        };
    }
    async getQueueSize(req) {
        const size = this.streamQueueService.getQueueSize(req.user.sub);
        return {
            success: true,
            data: { size },
        };
    }
    async addTrack(req, addTrackDto) {
        try {
            const queue = await this.streamQueueService.addTrack(req.user.sub, addTrackDto.trackId, addTrackDto.position);
            return {
                success: true,
                data: queue,
                message: 'Track added to queue successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async removeTrack(req, index) {
        try {
            const queue = await this.streamQueueService.removeTrack(req.user.sub, parseInt(index));
            return {
                success: true,
                data: queue,
                message: 'Track removed from queue successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async moveTrack(req, moveTrackDto) {
        try {
            const queue = await this.streamQueueService.moveTrack(req.user.sub, moveTrackDto.fromIndex, moveTrackDto.toIndex);
            return {
                success: true,
                data: queue,
                message: 'Track moved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async clearQueue(req) {
        const queue = await this.streamQueueService.clearQueue(req.user.sub);
        return {
            success: true,
            data: queue,
            message: 'Queue cleared successfully',
        };
    }
    async setCurrentTrack(req, index) {
        try {
            const queue = await this.streamQueueService.setCurrentTrack(req.user.sub, parseInt(index));
            return {
                success: true,
                data: queue,
                message: 'Current track set successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async nextTrack(req) {
        const queue = await this.streamQueueService.nextTrack(req.user.sub);
        return {
            success: true,
            data: queue,
            message: 'Skipped to next track',
        };
    }
    async previousTrack(req) {
        const queue = await this.streamQueueService.previousTrack(req.user.sub);
        return {
            success: true,
            data: queue,
            message: 'Skipped to previous track',
        };
    }
    async togglePlayPause(req) {
        const queue = await this.streamQueueService.togglePlayPause(req.user.sub);
        return {
            success: true,
            data: queue,
            message: `${queue.isPlaying ? 'Playing' : 'Paused'}`,
        };
    }
    async setVolume(req, setVolumeDto) {
        const queue = await this.streamQueueService.setVolume(req.user.sub, setVolumeDto.volume);
        return {
            success: true,
            data: queue,
            message: `Volume set to ${Math.round(queue.volume * 100)}%`,
        };
    }
    async setRepeat(req, setRepeatDto) {
        const queue = await this.streamQueueService.setRepeat(req.user.sub, setRepeatDto.repeat);
        return {
            success: true,
            data: queue,
            message: `Repeat mode set to ${queue.repeat}`,
        };
    }
    async setShuffle(req, setShuffleDto) {
        const queue = await this.streamQueueService.setShuffle(req.user.sub, setShuffleDto.shuffle);
        return {
            success: true,
            data: queue,
            message: `Shuffle ${queue.shuffle ? 'enabled' : 'disabled'}`,
        };
    }
    async addAlbum(req, albumId) {
        try {
            const queue = await this.streamQueueService.addAlbum(req.user.sub, albumId);
            return {
                success: true,
                data: queue,
                message: 'Album added to queue successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async addPlaylist(req, playlistId) {
        try {
            const queue = await this.streamQueueService.addPlaylist(req.user.sub, playlistId);
            return {
                success: true,
                data: queue,
                message: 'Playlist added to queue successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
};
exports.StreamQueueController = StreamQueueController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user queue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Queue retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "getQueue", null);
__decorate([
    (0, common_1.Get)('current'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current playing track' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Current track retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "getCurrentTrack", null);
__decorate([
    (0, common_1.Get)('size'),
    (0, swagger_1.ApiOperation)({ summary: 'Get queue size' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Queue size retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "getQueueSize", null);
__decorate([
    (0, common_1.Post)('add-track'),
    (0, swagger_1.ApiOperation)({ summary: 'Add track to queue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Track added to queue successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AddTrackDto]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "addTrack", null);
__decorate([
    (0, common_1.Delete)('tracks/:index'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove track from queue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Track removed from queue successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "removeTrack", null);
__decorate([
    (0, common_1.Put)('move-track'),
    (0, swagger_1.ApiOperation)({ summary: 'Move track in queue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Track moved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, MoveTrackDto]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "moveTrack", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear queue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Queue cleared successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "clearQueue", null);
__decorate([
    (0, common_1.Put)('current/:index'),
    (0, swagger_1.ApiOperation)({ summary: 'Set current track by index' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current track set successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "setCurrentTrack", null);
__decorate([
    (0, common_1.Post)('next'),
    (0, swagger_1.ApiOperation)({ summary: 'Skip to next track' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Skipped to next track successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "nextTrack", null);
__decorate([
    (0, common_1.Post)('previous'),
    (0, swagger_1.ApiOperation)({ summary: 'Skip to previous track' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Skipped to previous track successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "previousTrack", null);
__decorate([
    (0, common_1.Post)('toggle-play-pause'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle play/pause' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Play/pause toggled successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "togglePlayPause", null);
__decorate([
    (0, common_1.Put)('volume'),
    (0, swagger_1.ApiOperation)({ summary: 'Set volume' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Volume set successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SetVolumeDto]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "setVolume", null);
__decorate([
    (0, common_1.Put)('repeat'),
    (0, swagger_1.ApiOperation)({ summary: 'Set repeat mode' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Repeat mode set successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SetRepeatDto]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "setRepeat", null);
__decorate([
    (0, common_1.Put)('shuffle'),
    (0, swagger_1.ApiOperation)({ summary: 'Set shuffle mode' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shuffle mode set successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SetShuffleDto]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "setShuffle", null);
__decorate([
    (0, common_1.Post)('add-album/:albumId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add entire album to queue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Album added to queue successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('albumId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "addAlbum", null);
__decorate([
    (0, common_1.Post)('add-playlist/:playlistId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add entire playlist to queue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Playlist added to queue successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('playlistId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StreamQueueController.prototype, "addPlaylist", null);
exports.StreamQueueController = StreamQueueController = __decorate([
    (0, swagger_1.ApiTags)('stream-queue'),
    (0, common_1.Controller)('stream-queue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [stream_queue_service_1.StreamQueueService])
], StreamQueueController);
//# sourceMappingURL=stream-queue.controller.js.map
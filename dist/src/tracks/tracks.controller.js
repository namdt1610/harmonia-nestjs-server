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
exports.TracksController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const tracks_service_1 = require("./tracks.service");
const track_schema_1 = require("../schemas/track.schema");
let TracksController = class TracksController {
    tracksService;
    constructor(tracksService) {
        this.tracksService = tracksService;
    }
    async create(createTrackDto, files) {
        if (files && files.length > 0) {
            files.forEach((file) => {
                if (file.mimetype.startsWith('audio/')) {
                    createTrackDto.file = `/media/tracks/audio/${file.filename}`;
                }
                else if (file.mimetype.startsWith('video/')) {
                    createTrackDto.video = `/media/tracks/video/${file.filename}`;
                }
                else if (file.mimetype.startsWith('image/')) {
                    createTrackDto.image = `/media/tracks/images/${file.filename}`;
                }
            });
        }
        return this.tracksService.create(createTrackDto);
    }
    async findAll(queryParams) {
        return this.tracksService.findAll(queryParams);
    }
    async getPopular(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.tracksService.getPopularTracks(limitNum);
    }
    async getRecent(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.tracksService.getRecentTracks(limitNum);
    }
    async search(query, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.tracksService.searchTracks(query, limitNum);
    }
    async getByArtist(artistId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.tracksService.getTracksByArtist(artistId, limitNum);
    }
    async getByAlbum(albumId) {
        return this.tracksService.getTracksByAlbum(albumId);
    }
    async findOne(id) {
        return this.tracksService.findById(id);
    }
    async update(id, updateTrackDto, files) {
        if (files && files.length > 0) {
            files.forEach((file) => {
                if (file.mimetype.startsWith('audio/')) {
                    updateTrackDto.file = `/media/tracks/audio/${file.filename}`;
                }
                else if (file.mimetype.startsWith('video/')) {
                    updateTrackDto.video = `/media/tracks/video/${file.filename}`;
                }
                else if (file.mimetype.startsWith('image/')) {
                    updateTrackDto.image = `/media/tracks/images/${file.filename}`;
                }
            });
        }
        return this.tracksService.update(id, updateTrackDto);
    }
    async remove(id) {
        return this.tracksService.remove(id);
    }
    async play(id) {
        return this.tracksService.incrementPlayCount(id);
    }
    async download(id) {
        return this.tracksService.incrementDownloadCount(id);
    }
};
exports.TracksController = TracksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new track' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Track created successfully',
        type: track_schema_1.Track,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Artist or Album not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 3)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tracks with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tracks retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular tracks' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Popular tracks retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "getPopular", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent tracks' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recent tracks retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search tracks' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('artist/:artistId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tracks by artist' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Artist tracks retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Artist not found' }),
    __param(0, (0, common_1.Param)('artistId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "getByArtist", null);
__decorate([
    (0, common_1.Get)('album/:albumId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tracks by album' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Album tracks retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Album not found' }),
    __param(0, (0, common_1.Param)('albumId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "getByAlbum", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get track by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Track retrieved successfully',
        type: track_schema_1.Track,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Track not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update track' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Track updated successfully',
        type: track_schema_1.Track,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Track not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 3)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Array]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete track' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Track deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Track not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/play'),
    (0, swagger_1.ApiOperation)({ summary: 'Increment play count' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Play count incremented',
        type: track_schema_1.Track,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Track not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "play", null);
__decorate([
    (0, common_1.Post)(':id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Increment download count' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Download count incremented',
        type: track_schema_1.Track,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Track not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "download", null);
exports.TracksController = TracksController = __decorate([
    (0, swagger_1.ApiTags)('tracks'),
    (0, common_1.Controller)('tracks'),
    __metadata("design:paramtypes", [tracks_service_1.TracksService])
], TracksController);
//# sourceMappingURL=tracks.controller.js.map
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
exports.StreamQueueResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class UserInfo {
    id;
    username;
    email;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfo.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfo.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfo.prototype, "email", void 0);
class TrackInfo {
    id;
    title;
    duration;
    audioFileUrl;
    artist;
    album;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], TrackInfo.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], TrackInfo.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], TrackInfo.prototype, "duration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], TrackInfo.prototype, "audioFileUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], TrackInfo.prototype, "artist", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], TrackInfo.prototype, "album", void 0);
class StreamQueueResponseDto {
    id;
    user;
    tracks;
    currentIndex;
    shuffle;
    repeat;
    lastPlayed;
    createdAt;
    updatedAt;
    currentTrack;
    nextTrack;
    totalTracks;
    totalDuration;
}
exports.StreamQueueResponseDto = StreamQueueResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the stream queue',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id?.toString() || obj.id),
    __metadata("design:type", String)
], StreamQueueResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The user who owns this stream queue',
        type: UserInfo,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UserInfo),
    __metadata("design:type", UserInfo)
], StreamQueueResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of tracks in the queue',
        type: [TrackInfo],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => TrackInfo),
    __metadata("design:type", Array)
], StreamQueueResponseDto.prototype, "tracks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current index of the playing track',
        example: 0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], StreamQueueResponseDto.prototype, "currentIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether shuffle is enabled',
        example: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], StreamQueueResponseDto.prototype, "shuffle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Repeat mode',
        example: 'off',
        enum: ['off', 'track', 'playlist'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], StreamQueueResponseDto.prototype, "repeat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the queue was last played',
        example: '2023-12-01T12:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], StreamQueueResponseDto.prototype, "lastPlayed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the queue was created',
        example: '2023-12-01T12:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], StreamQueueResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the queue was last updated',
        example: '2023-12-01T12:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], StreamQueueResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The currently playing track (computed)',
        type: TrackInfo,
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => TrackInfo),
    __metadata("design:type", TrackInfo)
], StreamQueueResponseDto.prototype, "currentTrack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The next track in the queue (computed)',
        type: TrackInfo,
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => TrackInfo),
    __metadata("design:type", TrackInfo)
], StreamQueueResponseDto.prototype, "nextTrack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of tracks in the queue',
        example: 10,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj.tracks?.length || 0),
    __metadata("design:type", Number)
], StreamQueueResponseDto.prototype, "totalTracks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total duration of all tracks in the queue (in seconds)',
        example: 2400,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => {
        if (!obj.tracks || !Array.isArray(obj.tracks))
            return 0;
        return obj.tracks.reduce((total, track) => total + (track.duration || 0), 0);
    }),
    __metadata("design:type", Number)
], StreamQueueResponseDto.prototype, "totalDuration", void 0);
//# sourceMappingURL=stream-queue-response.dto.js.map
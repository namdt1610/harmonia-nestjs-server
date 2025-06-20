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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAnalyticsResponseDto = exports.AnalyticsStatsResponseDto = exports.UserActivityResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_activity_schema_1 = require("../../schemas/user-activity.schema");
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
    __metadata("design:type", Object)
], TrackInfo.prototype, "artist", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], TrackInfo.prototype, "album", void 0);
class UserActivityResponseDto {
    id;
    activityType;
    metadata;
    ipAddress;
    userAgent;
    user;
    track;
    createdAt;
}
exports.UserActivityResponseDto = UserActivityResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the activity',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id?.toString() || obj.id),
    __metadata("design:type", String)
], UserActivityResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of activity',
        enum: user_activity_schema_1.ActivityType,
        example: user_activity_schema_1.ActivityType.PLAY,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", typeof (_a = typeof user_activity_schema_1.ActivityType !== "undefined" && user_activity_schema_1.ActivityType) === "function" ? _a : Object)
], UserActivityResponseDto.prototype, "activityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata about the activity',
        example: { playedFor: 30, volume: 0.8 },
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserActivityResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IP address of the user',
        example: '192.168.1.1',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserActivityResponseDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User agent string',
        example: 'Mozilla/5.0...',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserActivityResponseDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The user who performed the activity',
        type: UserInfo,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UserInfo),
    __metadata("design:type", UserInfo)
], UserActivityResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The track related to the activity',
        type: TrackInfo,
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => TrackInfo),
    __metadata("design:type", TrackInfo)
], UserActivityResponseDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the activity was performed',
        example: '2023-12-01T12:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserActivityResponseDto.prototype, "createdAt", void 0);
class AnalyticsStatsResponseDto {
    totalActivities;
    uniqueUsers;
    activitiesByType;
    mostActiveUsers;
    mostPlayedTracks;
    activityTimeline;
    peakHours;
}
exports.AnalyticsStatsResponseDto = AnalyticsStatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of activities tracked',
        example: 1000,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AnalyticsStatsResponseDto.prototype, "totalActivities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of unique users with activities',
        example: 100,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AnalyticsStatsResponseDto.prototype, "uniqueUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity breakdown by type',
        example: {
            PLAY: 500,
            DOWNLOAD: 200,
            LIKE: 150,
            SKIP: 100,
            SHARE: 50,
        },
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], AnalyticsStatsResponseDto.prototype, "activitiesByType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Most active users',
        example: [
            {
                userId: '507f1f77bcf86cd799439011',
                username: 'user1',
                activityCount: 50,
            },
            {
                userId: '507f1f77bcf86cd799439012',
                username: 'user2',
                activityCount: 45,
            },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], AnalyticsStatsResponseDto.prototype, "mostActiveUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Most played tracks',
        example: [
            { trackId: '507f1f77bcf86cd799439011', title: 'Song 1', playCount: 100 },
            { trackId: '507f1f77bcf86cd799439012', title: 'Song 2', playCount: 85 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], AnalyticsStatsResponseDto.prototype, "mostPlayedTracks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity timeline (last 30 days)',
        example: [
            { date: '2023-12-01', count: 50 },
            { date: '2023-12-02', count: 45 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], AnalyticsStatsResponseDto.prototype, "activityTimeline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Peak activity hours (0-23)',
        example: [
            { hour: 14, count: 120 },
            { hour: 20, count: 115 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], AnalyticsStatsResponseDto.prototype, "peakHours", void 0);
class UserAnalyticsResponseDto {
    user;
    totalActivities;
    activitiesByType;
    mostPlayedTracks;
    activityTimeline;
    listeningPatterns;
    firstActivityDate;
    lastActivityDate;
}
exports.UserAnalyticsResponseDto = UserAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User information',
        type: UserInfo,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UserInfo),
    __metadata("design:type", UserInfo)
], UserAnalyticsResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total activities by this user',
        example: 150,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UserAnalyticsResponseDto.prototype, "totalActivities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User activity breakdown by type',
        example: {
            PLAY: 100,
            DOWNLOAD: 20,
            LIKE: 15,
            SKIP: 10,
            SHARE: 5,
        },
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserAnalyticsResponseDto.prototype, "activitiesByType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User's most played tracks",
        example: [
            { trackId: '507f1f77bcf86cd799439011', title: 'Song 1', playCount: 25 },
            { trackId: '507f1f77bcf86cd799439012', title: 'Song 2', playCount: 20 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UserAnalyticsResponseDto.prototype, "mostPlayedTracks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User activity timeline (last 30 days)',
        example: [
            { date: '2023-12-01', count: 5 },
            { date: '2023-12-02', count: 8 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UserAnalyticsResponseDto.prototype, "activityTimeline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User's listening patterns by hour",
        example: [
            { hour: 14, count: 12 },
            { hour: 20, count: 15 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UserAnalyticsResponseDto.prototype, "listeningPatterns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'First activity date',
        example: '2023-11-01T10:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserAnalyticsResponseDto.prototype, "firstActivityDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last activity date',
        example: '2023-12-01T15:30:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserAnalyticsResponseDto.prototype, "lastActivityDate", void 0);
//# sourceMappingURL=analytics-response.dto.js.map
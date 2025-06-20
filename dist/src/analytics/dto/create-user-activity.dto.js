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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserActivityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
const user_activity_schema_1 = require("../../schemas/user-activity.schema");
class CreateUserActivityDto {
    activityType;
    metadata;
    ipAddress;
    userAgent;
    user;
    track;
}
exports.CreateUserActivityDto = CreateUserActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of activity being tracked',
        enum: user_activity_schema_1.ActivityType,
        example: user_activity_schema_1.ActivityType.PLAY,
    }),
    (0, class_validator_1.IsEnum)(user_activity_schema_1.ActivityType),
    __metadata("design:type", typeof (_a = typeof user_activity_schema_1.ActivityType !== "undefined" && user_activity_schema_1.ActivityType) === "function" ? _a : Object)
], CreateUserActivityDto.prototype, "activityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata about the activity',
        example: { playedFor: 30, volume: 0.8 },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateUserActivityDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IP address of the user',
        example: '192.168.1.1',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserActivityDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User agent string',
        example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserActivityDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the user performing the activity',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => new mongoose_1.Types.ObjectId(value)),
    __metadata("design:type", typeof (_b = typeof mongoose_1.Types !== "undefined" && mongoose_1.Types.ObjectId) === "function" ? _b : Object)
], CreateUserActivityDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the track related to the activity (if applicable)',
        example: '507f1f77bcf86cd799439012',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new mongoose_1.Types.ObjectId(value) : undefined)),
    __metadata("design:type", typeof (_c = typeof mongoose_1.Types !== "undefined" && mongoose_1.Types.ObjectId) === "function" ? _c : Object)
], CreateUserActivityDto.prototype, "track", void 0);
//# sourceMappingURL=create-user-activity.dto.js.map
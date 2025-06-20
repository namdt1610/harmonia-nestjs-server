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
exports.CreateStreamQueueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStreamQueueDto {
    user;
    tracks;
    currentIndex;
    shuffle;
    repeat;
}
exports.CreateStreamQueueDto = CreateStreamQueueDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the user who owns this stream queue',
        example: 'cm123abc456def789',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStreamQueueDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of track IDs in the queue',
        type: [String],
        example: ['cm123abc456def790', 'cm123abc456def791'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateStreamQueueDto.prototype, "tracks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current index of the playing track',
        example: 0,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateStreamQueueDto.prototype, "currentIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether shuffle is enabled',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateStreamQueueDto.prototype, "shuffle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Repeat mode: off, track, or playlist',
        example: 'off',
        enum: ['off', 'track', 'playlist'],
        default: 'off',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['off', 'track', 'playlist']),
    __metadata("design:type", String)
], CreateStreamQueueDto.prototype, "repeat", void 0);
//# sourceMappingURL=create-stream-queue.dto.js.map
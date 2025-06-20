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
exports.UpdateStreamQueueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateStreamQueueDto {
    tracks;
    currentIndex;
    shuffle;
    repeat;
}
exports.UpdateStreamQueueDto = UpdateStreamQueueDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of track IDs in the queue',
        type: [String],
        example: ['cm123abc456def790', 'cm123abc456def791'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateStreamQueueDto.prototype, "tracks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current index of the playing track',
        example: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateStreamQueueDto.prototype, "currentIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether shuffle is enabled',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStreamQueueDto.prototype, "shuffle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Repeat mode: off, track, or playlist',
        example: 'off',
        enum: ['off', 'track', 'playlist'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['off', 'track', 'playlist']),
    __metadata("design:type", String)
], UpdateStreamQueueDto.prototype, "repeat", void 0);
//# sourceMappingURL=update-stream-queue.dto.js.map
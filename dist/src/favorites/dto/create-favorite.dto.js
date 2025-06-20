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
exports.CreateFavoriteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
const favorite_schema_1 = require("../../schemas/favorite.schema");
class CreateFavoriteDto {
    user;
    type;
    itemId;
}
exports.CreateFavoriteDto = CreateFavoriteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the user adding the favorite',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => new mongoose_1.Types.ObjectId(value)),
    __metadata("design:type", typeof (_a = typeof mongoose_1.Types !== "undefined" && mongoose_1.Types.ObjectId) === "function" ? _a : Object)
], CreateFavoriteDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of item being favorited',
        enum: favorite_schema_1.FavoriteType,
        example: favorite_schema_1.FavoriteType.TRACK,
    }),
    (0, class_validator_1.IsEnum)(favorite_schema_1.FavoriteType),
    __metadata("design:type", typeof (_b = typeof favorite_schema_1.FavoriteType !== "undefined" && favorite_schema_1.FavoriteType) === "function" ? _b : Object)
], CreateFavoriteDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the item being favorited',
        example: '507f1f77bcf86cd799439012',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => new mongoose_1.Types.ObjectId(value)),
    __metadata("design:type", typeof (_c = typeof mongoose_1.Types !== "undefined" && mongoose_1.Types.ObjectId) === "function" ? _c : Object)
], CreateFavoriteDto.prototype, "itemId", void 0);
//# sourceMappingURL=create-favorite.dto.js.map
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
exports.FavoriteResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const favorite_schema_1 = require("../../schemas/favorite.schema");
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
class ArtistInfo {
    id;
    name;
    image;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ArtistInfo.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ArtistInfo.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ArtistInfo.prototype, "image", void 0);
class AlbumInfo {
    id;
    title;
    image;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AlbumInfo.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AlbumInfo.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AlbumInfo.prototype, "image", void 0);
class PlaylistInfo {
    id;
    name;
    isPublic;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PlaylistInfo.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PlaylistInfo.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], PlaylistInfo.prototype, "isPublic", void 0);
class FavoriteResponseDto {
    id;
    user;
    type;
    itemId;
    item;
    addedAt;
    createdAt;
    updatedAt;
}
exports.FavoriteResponseDto = FavoriteResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the favorite',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id?.toString() || obj.id),
    __metadata("design:type", String)
], FavoriteResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The user who added the favorite',
        type: UserInfo,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UserInfo),
    __metadata("design:type", UserInfo)
], FavoriteResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of item being favorited',
        enum: favorite_schema_1.FavoriteType,
        example: favorite_schema_1.FavoriteType.TRACK,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", typeof (_a = typeof favorite_schema_1.FavoriteType !== "undefined" && favorite_schema_1.FavoriteType) === "function" ? _a : Object)
], FavoriteResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the favorited item',
        example: '507f1f77bcf86cd799439012',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], FavoriteResponseDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The detailed information of the favorited item',
        oneOf: [
            { $ref: '#/components/schemas/TrackInfo' },
            { $ref: '#/components/schemas/ArtistInfo' },
            { $ref: '#/components/schemas/AlbumInfo' },
            { $ref: '#/components/schemas/PlaylistInfo' },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], FavoriteResponseDto.prototype, "item", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the item was added to favorites',
        example: '2023-12-01T12:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], FavoriteResponseDto.prototype, "addedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the favorite was created',
        example: '2023-12-01T12:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], FavoriteResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the favorite was last updated',
        example: '2023-12-01T12:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], FavoriteResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=favorite-response.dto.js.map
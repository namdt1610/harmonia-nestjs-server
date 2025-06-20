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
exports.TrackResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ArtistBasicInfo {
    id;
    name;
    image;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], ArtistBasicInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ArtistBasicInfo.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ArtistBasicInfo.prototype, "image", void 0);
class AlbumBasicInfo {
    id;
    title;
    image;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], AlbumBasicInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlbumBasicInfo.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AlbumBasicInfo.prototype, "image", void 0);
class GenreBasicInfo {
    id;
    name;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], GenreBasicInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GenreBasicInfo.prototype, "name", void 0);
class TrackResponseDto {
    id;
    title;
    file;
    video;
    image;
    videoThumbnail;
    duration;
    lyrics;
    playCount;
    downloadCount;
    isDownloadable;
    artist;
    album;
    genres;
    createdAt;
    updatedAt;
}
exports.TrackResponseDto = TrackResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], TrackResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TrackResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TrackResponseDto.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TrackResponseDto.prototype, "video", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TrackResponseDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TrackResponseDto.prototype, "videoThumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], TrackResponseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TrackResponseDto.prototype, "lyrics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TrackResponseDto.prototype, "playCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TrackResponseDto.prototype, "downloadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TrackResponseDto.prototype, "isDownloadable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ArtistBasicInfo }),
    (0, class_transformer_1.Type)(() => ArtistBasicInfo),
    __metadata("design:type", ArtistBasicInfo)
], TrackResponseDto.prototype, "artist", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: AlbumBasicInfo }),
    (0, class_transformer_1.Type)(() => AlbumBasicInfo),
    __metadata("design:type", AlbumBasicInfo)
], TrackResponseDto.prototype, "album", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [GenreBasicInfo] }),
    (0, class_transformer_1.Type)(() => GenreBasicInfo),
    __metadata("design:type", Array)
], TrackResponseDto.prototype, "genres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TrackResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TrackResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=track-response.dto.js.map
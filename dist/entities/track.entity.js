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
exports.Track = void 0;
const typeorm_1 = require("typeorm");
const artist_entity_1 = require("./artist.entity");
const album_entity_1 = require("./album.entity");
const genre_entity_1 = require("./genre.entity");
const playlist_entity_1 = require("./playlist.entity");
let Track = class Track {
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
    createdAt;
    updatedAt;
    artist;
    album;
    genres;
    playlists;
    incrementPlayCount() {
        this.playCount += 1;
    }
    incrementDownloadCount() {
        this.downloadCount += 1;
    }
};
exports.Track = Track;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Track.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Track.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Track.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Track.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Track.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'video_thumbnail', nullable: true }),
    __metadata("design:type", String)
], Track.prototype, "videoThumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, comment: 'Duration in seconds' }),
    __metadata("design:type", Number)
], Track.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Track.prototype, "lyrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'play_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Track.prototype, "playCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'download_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Track.prototype, "downloadCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_downloadable', default: true }),
    __metadata("design:type", Boolean)
], Track.prototype, "isDownloadable", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Track.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Track.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => artist_entity_1.Artist, (artist) => artist.tracks, {
        onDelete: 'CASCADE',
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'artist_id' }),
    __metadata("design:type", artist_entity_1.Artist)
], Track.prototype, "artist", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => album_entity_1.Album, (album) => album.tracks, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'album_id' }),
    __metadata("design:type", album_entity_1.Album)
], Track.prototype, "album", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => genre_entity_1.Genre, (genre) => genre.tracks),
    (0, typeorm_1.JoinTable)({
        name: 'track_genres',
        joinColumn: { name: 'track_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Track.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => playlist_entity_1.Playlist, (playlist) => playlist.tracks),
    __metadata("design:type", Array)
], Track.prototype, "playlists", void 0);
exports.Track = Track = __decorate([
    (0, typeorm_1.Entity)('tracks'),
    (0, typeorm_1.Index)(['title']),
    (0, typeorm_1.Index)(['artist']),
    (0, typeorm_1.Index)(['album'])
], Track);
//# sourceMappingURL=track.entity.js.map
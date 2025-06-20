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
exports.Album = void 0;
const typeorm_1 = require("typeorm");
const artist_entity_1 = require("./artist.entity");
const track_entity_1 = require("./track.entity");
let Album = class Album {
    id;
    title;
    releaseDate;
    image;
    description;
    createdAt;
    updatedAt;
    artist;
    tracks;
};
exports.Album = Album;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Album.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Album.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'release_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Album.prototype, "releaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Album.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Album.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Album.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Album.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => artist_entity_1.Artist, (artist) => artist.albums, {
        onDelete: 'CASCADE',
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'artist_id' }),
    __metadata("design:type", artist_entity_1.Artist)
], Album.prototype, "artist", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => track_entity_1.Track, (track) => track.album),
    __metadata("design:type", Array)
], Album.prototype, "tracks", void 0);
exports.Album = Album = __decorate([
    (0, typeorm_1.Entity)('albums'),
    (0, typeorm_1.Index)(['title']),
    (0, typeorm_1.Unique)(['title', 'artist'])
], Album);
//# sourceMappingURL=album.entity.js.map
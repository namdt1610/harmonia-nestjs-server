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
exports.Artist = void 0;
const typeorm_1 = require("typeorm");
const track_entity_1 = require("./track.entity");
const album_entity_1 = require("./album.entity");
let Artist = class Artist {
    id;
    name;
    bio;
    image;
    createdAt;
    updatedAt;
    tracks;
    albums;
};
exports.Artist = Artist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Artist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, default: 'No bio available' }),
    __metadata("design:type", String)
], Artist.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Artist.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Artist.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Artist.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => track_entity_1.Track, (track) => track.artist),
    __metadata("design:type", Array)
], Artist.prototype, "tracks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => album_entity_1.Album, (album) => album.artist),
    __metadata("design:type", Array)
], Artist.prototype, "albums", void 0);
exports.Artist = Artist = __decorate([
    (0, typeorm_1.Entity)('artists'),
    (0, typeorm_1.Index)(['name'])
], Artist);
//# sourceMappingURL=artist.entity.js.map
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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const playlist_entity_1 = require("./playlist.entity");
const track_entity_1 = require("./track.entity");
const artist_entity_1 = require("./artist.entity");
const album_entity_1 = require("./album.entity");
const user_subscription_entity_1 = require("./user-subscription.entity");
const user_activity_entity_1 = require("./user-activity.entity");
let User = class User {
    id;
    email;
    username;
    password;
    firstName;
    lastName;
    isActive;
    isStaff;
    isSuperuser;
    dateJoined;
    lastLogin;
    bio;
    image;
    googleSub;
    createdAt;
    updatedAt;
    playlists;
    favoriteTracks;
    favoriteArtists;
    favoriteAlbums;
    subscription;
    activities;
    recentlyPlayed;
    get fullName() {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_staff', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isStaff", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_superuser', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isSuperuser", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'date_joined',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], User.prototype, "dateJoined", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'google_sub', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleSub", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => playlist_entity_1.Playlist, (playlist) => playlist.user),
    __metadata("design:type", Array)
], User.prototype, "playlists", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => track_entity_1.Track),
    (0, typeorm_1.JoinTable)({
        name: 'user_favorite_tracks',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "favoriteTracks", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => artist_entity_1.Artist),
    (0, typeorm_1.JoinTable)({
        name: 'user_favorite_artists',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'artist_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "favoriteArtists", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => album_entity_1.Album),
    (0, typeorm_1.JoinTable)({
        name: 'user_favorite_albums',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'album_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "favoriteAlbums", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_subscription_entity_1.UserSubscription, (subscription) => subscription.user),
    __metadata("design:type", user_subscription_entity_1.UserSubscription)
], User.prototype, "subscription", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_activity_entity_1.UserActivity, (activity) => activity.user),
    __metadata("design:type", Array)
], User.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => track_entity_1.Track),
    (0, typeorm_1.JoinTable)({
        name: 'user_recently_played',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "recentlyPlayed", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)(['email']),
    (0, typeorm_1.Index)(['username'])
], User);
//# sourceMappingURL=user.entity.js.map
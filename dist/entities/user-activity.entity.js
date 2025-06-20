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
exports.UserActivity = exports.ActivityType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const track_entity_1 = require("./track.entity");
var ActivityType;
(function (ActivityType) {
    ActivityType["PLAY"] = "PLAY";
    ActivityType["DOWNLOAD"] = "DOWNLOAD";
    ActivityType["LIKE"] = "LIKE";
    ActivityType["SKIP"] = "SKIP";
    ActivityType["SHARE"] = "SHARE";
    ActivityType["PLAYLIST_CREATE"] = "PLAYLIST_CREATE";
    ActivityType["PLAYLIST_ADD"] = "PLAYLIST_ADD";
    ActivityType["SEARCH"] = "SEARCH";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
let UserActivity = class UserActivity {
    id;
    activityType;
    metadata;
    ipAddress;
    userAgent;
    createdAt;
    user;
    track;
};
exports.UserActivity = UserActivity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserActivity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActivityType,
        name: 'activity_type',
    }),
    __metadata("design:type", String)
], UserActivity.prototype, "activityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], UserActivity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', nullable: true }),
    __metadata("design:type", String)
], UserActivity.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', nullable: true }),
    __metadata("design:type", String)
], UserActivity.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserActivity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.activities, {
        onDelete: 'CASCADE',
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserActivity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => track_entity_1.Track, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'track_id' }),
    __metadata("design:type", track_entity_1.Track)
], UserActivity.prototype, "track", void 0);
exports.UserActivity = UserActivity = __decorate([
    (0, typeorm_1.Entity)('user_activities'),
    (0, typeorm_1.Index)(['user', 'activityType']),
    (0, typeorm_1.Index)(['createdAt'])
], UserActivity);
//# sourceMappingURL=user-activity.entity.js.map
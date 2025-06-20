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
exports.UserSubscription = exports.SubscriptionStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const subscription_plan_entity_1 = require("./subscription-plan.entity");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
    SubscriptionStatus["TRIAL"] = "TRIAL";
    SubscriptionStatus["PAUSED"] = "PAUSED";
    SubscriptionStatus["PENDING"] = "PENDING";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
let UserSubscription = class UserSubscription {
    id;
    status;
    startDate;
    endDate;
    trialEndDate;
    autoRenew;
    paymentMethod;
    externalSubscriptionId;
    offlineTracksDownloaded;
    playlistsCreated;
    skipsUsedToday;
    lastSkipReset;
    createdAt;
    updatedAt;
    user;
    plan;
    get isActive() {
        const now = new Date();
        return (this.status === SubscriptionStatus.ACTIVE &&
            this.endDate > now &&
            (!this.trialEndDate || this.trialEndDate > now));
    }
    get isTrial() {
        const now = new Date();
        return (this.status === SubscriptionStatus.TRIAL &&
            this.trialEndDate &&
            this.trialEndDate > now);
    }
    get daysRemaining() {
        if (!this.isActive)
            return 0;
        const now = new Date();
        const timeDiff = this.endDate.getTime() - now.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    canSkipTracks() {
        const today = new Date().toDateString();
        if (this.lastSkipReset.toDateString() !== today) {
            this.skipsUsedToday = 0;
            this.lastSkipReset = new Date();
        }
        if (this.plan.skipLimit === 0) {
            return true;
        }
        return this.skipsUsedToday < this.plan.skipLimit;
    }
    useSkip() {
        if (this.canSkipTracks() && this.plan.skipLimit > 0) {
            this.skipsUsedToday += 1;
            return true;
        }
        return false;
    }
    canDownloadTracks() {
        if (!this.plan.canDownload) {
            return false;
        }
        if (this.plan.maxOfflineTracks === 0) {
            return true;
        }
        return this.offlineTracksDownloaded < this.plan.maxOfflineTracks;
    }
    canCreatePlaylist() {
        if (this.plan.maxPlaylists === 0) {
            return true;
        }
        return this.playlistsCreated < this.plan.maxPlaylists;
    }
};
exports.UserSubscription = UserSubscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.PENDING,
    }),
    __metadata("design:type", String)
], UserSubscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'start_date',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trial_end_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "trialEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'auto_renew', default: true }),
    __metadata("design:type", Boolean)
], UserSubscription.prototype, "autoRenew", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method', nullable: true }),
    __metadata("design:type", String)
], UserSubscription.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'external_subscription_id', nullable: true }),
    __metadata("design:type", String)
], UserSubscription.prototype, "externalSubscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offline_tracks_downloaded', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserSubscription.prototype, "offlineTracksDownloaded", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'playlists_created', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserSubscription.prototype, "playlistsCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'skips_used_today', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserSubscription.prototype, "skipsUsedToday", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_skip_reset',
        type: 'date',
        default: () => 'CURRENT_DATE',
    }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "lastSkipReset", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.subscription, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserSubscription.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_plan_entity_1.SubscriptionPlan, (plan) => plan.subscriptions, {
        onDelete: 'RESTRICT',
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'plan_id' }),
    __metadata("design:type", subscription_plan_entity_1.SubscriptionPlan)
], UserSubscription.prototype, "plan", void 0);
exports.UserSubscription = UserSubscription = __decorate([
    (0, typeorm_1.Entity)('user_subscriptions')
], UserSubscription);
//# sourceMappingURL=user-subscription.entity.js.map
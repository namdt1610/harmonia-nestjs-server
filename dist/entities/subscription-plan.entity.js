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
exports.SubscriptionPlan = exports.AudioQuality = exports.BillingCycle = exports.PlanType = void 0;
const typeorm_1 = require("typeorm");
const user_subscription_entity_1 = require("./user-subscription.entity");
var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "FREE";
    PlanType["PREMIUM"] = "PREMIUM";
    PlanType["FAMILY"] = "FAMILY";
    PlanType["STUDENT"] = "STUDENT";
    PlanType["ARTIST"] = "ARTIST";
})(PlanType || (exports.PlanType = PlanType = {}));
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["MONTHLY"] = "MONTHLY";
    BillingCycle["YEARLY"] = "YEARLY";
    BillingCycle["LIFETIME"] = "LIFETIME";
})(BillingCycle || (exports.BillingCycle = BillingCycle = {}));
var AudioQuality;
(function (AudioQuality) {
    AudioQuality["STANDARD"] = "STANDARD";
    AudioQuality["HIGH"] = "HIGH";
    AudioQuality["LOSSLESS"] = "LOSSLESS";
})(AudioQuality || (exports.AudioQuality = AudioQuality = {}));
let SubscriptionPlan = class SubscriptionPlan {
    id;
    name;
    planType;
    billingCycle;
    price;
    currency;
    maxOfflineTracks;
    audioQuality;
    adsFree;
    skipLimit;
    canDownload;
    canCreatePlaylists;
    maxPlaylists;
    familyAccounts;
    canUploadMusic;
    analyticsAccess;
    prioritySupport;
    description;
    featuresList;
    isActive;
    sortOrder;
    createdAt;
    updatedAt;
    subscriptions;
    get monthlyPrice() {
        if (this.billingCycle === BillingCycle.YEARLY) {
            return this.price / 12;
        }
        else if (this.billingCycle === BillingCycle.LIFETIME) {
            return this.price / 120;
        }
        return this.price;
    }
};
exports.SubscriptionPlan = SubscriptionPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlanType,
        name: 'plan_type',
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "planType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BillingCycle,
        name: 'billing_cycle',
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "billingCycle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_offline_tracks',
        type: 'int',
        default: 0,
        comment: '0 = unlimited',
    }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxOfflineTracks", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AudioQuality,
        name: 'audio_quality',
        default: AudioQuality.STANDARD,
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "audioQuality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ads_free', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "adsFree", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'skip_limit',
        type: 'int',
        default: 6,
        comment: 'per hour, 0 = unlimited',
    }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "skipLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_download', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "canDownload", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_create_playlists', default: true }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "canCreatePlaylists", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_playlists',
        type: 'int',
        default: 20,
        comment: '0 = unlimited',
    }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxPlaylists", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'family_accounts', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "familyAccounts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_upload_music', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "canUploadMusic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'analytics_access', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "analyticsAccess", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'priority_support', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "prioritySupport", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'features_list', default: [] }),
    __metadata("design:type", Array)
], SubscriptionPlan.prototype, "featuresList", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_subscription_entity_1.UserSubscription, (subscription) => subscription.plan),
    __metadata("design:type", Array)
], SubscriptionPlan.prototype, "subscriptions", void 0);
exports.SubscriptionPlan = SubscriptionPlan = __decorate([
    (0, typeorm_1.Entity)('subscription_plans')
], SubscriptionPlan);
//# sourceMappingURL=subscription-plan.entity.js.map
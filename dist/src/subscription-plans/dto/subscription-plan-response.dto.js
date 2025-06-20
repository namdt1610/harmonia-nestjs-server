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
exports.SubscriptionPlanResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const subscription_plan_schema_1 = require("../../schemas/subscription-plan.schema");
class SubscriptionPlanResponseDto {
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
    monthlyPrice;
    createdAt;
    updatedAt;
}
exports.SubscriptionPlanResponseDto = SubscriptionPlanResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], SubscriptionPlanResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionPlanResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_plan_schema_1.PlanType }),
    __metadata("design:type", typeof (_a = typeof subscription_plan_schema_1.PlanType !== "undefined" && subscription_plan_schema_1.PlanType) === "function" ? _a : Object)
], SubscriptionPlanResponseDto.prototype, "planType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_plan_schema_1.BillingCycle }),
    __metadata("design:type", typeof (_b = typeof subscription_plan_schema_1.BillingCycle !== "undefined" && subscription_plan_schema_1.BillingCycle) === "function" ? _b : Object)
], SubscriptionPlanResponseDto.prototype, "billingCycle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionPlanResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "maxOfflineTracks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_plan_schema_1.AudioQuality }),
    __metadata("design:type", typeof (_c = typeof subscription_plan_schema_1.AudioQuality !== "undefined" && subscription_plan_schema_1.AudioQuality) === "function" ? _c : Object)
], SubscriptionPlanResponseDto.prototype, "audioQuality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "adsFree", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "skipLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "canDownload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "canCreatePlaylists", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "maxPlaylists", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "familyAccounts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "canUploadMusic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "analyticsAccess", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "prioritySupport", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SubscriptionPlanResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], SubscriptionPlanResponseDto.prototype, "featuresList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "monthlyPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionPlanResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionPlanResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=subscription-plan-response.dto.js.map
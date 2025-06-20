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
exports.CreateSubscriptionPlanDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const subscription_plan_schema_1 = require("../../schemas/subscription-plan.schema");
class CreateSubscriptionPlanDto {
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
}
exports.CreateSubscriptionPlanDto = CreateSubscriptionPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Premium Monthly' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubscriptionPlanDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_plan_schema_1.PlanType, example: subscription_plan_schema_1.PlanType.PREMIUM }),
    (0, class_validator_1.IsEnum)(subscription_plan_schema_1.PlanType),
    __metadata("design:type", typeof (_a = typeof subscription_plan_schema_1.PlanType !== "undefined" && subscription_plan_schema_1.PlanType) === "function" ? _a : Object)
], CreateSubscriptionPlanDto.prototype, "planType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_plan_schema_1.BillingCycle, example: subscription_plan_schema_1.BillingCycle.MONTHLY }),
    (0, class_validator_1.IsEnum)(subscription_plan_schema_1.BillingCycle),
    __metadata("design:type", typeof (_b = typeof subscription_plan_schema_1.BillingCycle !== "undefined" && subscription_plan_schema_1.BillingCycle) === "function" ? _b : Object)
], CreateSubscriptionPlanDto.prototype, "billingCycle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 9.99 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateSubscriptionPlanDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'USD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubscriptionPlanDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100, description: '0 means unlimited' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateSubscriptionPlanDto.prototype, "maxOfflineTracks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: subscription_plan_schema_1.AudioQuality, example: subscription_plan_schema_1.AudioQuality.HIGH }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(subscription_plan_schema_1.AudioQuality),
    __metadata("design:type", typeof (_c = typeof subscription_plan_schema_1.AudioQuality !== "undefined" && subscription_plan_schema_1.AudioQuality) === "function" ? _c : Object)
], CreateSubscriptionPlanDto.prototype, "audioQuality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSubscriptionPlanDto.prototype, "adsFree", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 6,
        description: 'per hour, 0 means unlimited',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateSubscriptionPlanDto.prototype, "skipLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSubscriptionPlanDto.prototype, "canDownload", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSubscriptionPlanDto.prototype, "canCreatePlaylists", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50, description: '0 means unlimited' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateSubscriptionPlanDto.prototype, "maxPlaylists", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateSubscriptionPlanDto.prototype, "familyAccounts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSubscriptionPlanDto.prototype, "canUploadMusic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSubscriptionPlanDto.prototype, "analyticsAccess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSubscriptionPlanDto.prototype, "prioritySupport", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Premium plan with high-quality audio and no ads',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubscriptionPlanDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['High-quality audio', 'No ads', 'Unlimited skips'],
        description: 'List of features',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSubscriptionPlanDto.prototype, "featuresList", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSubscriptionPlanDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateSubscriptionPlanDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-subscription-plan.dto.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_plan_schema_1 = require("../schemas/subscription-plan.schema");
let SubscriptionPlanRepository = class SubscriptionPlanRepository {
    subscriptionPlanModel;
    constructor(subscriptionPlanModel) {
        this.subscriptionPlanModel = subscriptionPlanModel;
    }
    async create(createSubscriptionPlanDto) {
        const subscriptionPlan = new this.subscriptionPlanModel(createSubscriptionPlanDto);
        return await subscriptionPlan.save();
    }
    async findAll(page = 1, limit = 10, filters = {}) {
        const query = {};
        if (filters.planType) {
            query.planType = filters.planType;
        }
        if (filters.billingCycle) {
            query.billingCycle = filters.billingCycle;
        }
        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        if (filters.minPrice !== undefined) {
            query.price = { ...query.price, $gte: filters.minPrice };
        }
        if (filters.maxPrice !== undefined) {
            query.price = { ...query.price, $lte: filters.maxPrice };
        }
        const skip = (page - 1) * limit;
        const [plans, total] = await Promise.all([
            this.subscriptionPlanModel
                .find(query)
                .sort({ sortOrder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('subscriptions')
                .exec(),
            this.subscriptionPlanModel.countDocuments(query),
        ]);
        return {
            plans,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.subscriptionPlanModel
            .findById(id)
            .populate('subscriptions')
            .exec();
    }
    async findByPlanType(planType) {
        return await this.subscriptionPlanModel
            .find({ planType, isActive: true })
            .sort({ sortOrder: 1 })
            .exec();
    }
    async findActivePlans() {
        return await this.subscriptionPlanModel
            .find({ isActive: true })
            .sort({ sortOrder: 1 })
            .exec();
    }
    async findByBillingCycle(billingCycle) {
        return await this.subscriptionPlanModel
            .find({ billingCycle, isActive: true })
            .sort({ price: 1 })
            .exec();
    }
    async findMostPopular(limit = 5) {
        return await this.subscriptionPlanModel
            .aggregate([
            { $match: { isActive: true } },
            {
                $addFields: {
                    subscriptionCount: { $size: '$subscriptions' },
                },
            },
            { $sort: { subscriptionCount: -1, sortOrder: 1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'usersubscriptions',
                    localField: 'subscriptions',
                    foreignField: '_id',
                    as: 'subscriptions',
                },
            },
        ])
            .exec();
    }
    async update(id, updateSubscriptionPlanDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.subscriptionPlanModel
            .findByIdAndUpdate(id, updateSubscriptionPlanDto, { new: true })
            .populate('subscriptions')
            .exec();
    }
    async delete(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return false;
        }
        const result = await this.subscriptionPlanModel.findByIdAndDelete(id);
        return !!result;
    }
    async addSubscription(planId, subscriptionId) {
        if (!mongoose_2.Types.ObjectId.isValid(planId) ||
            !mongoose_2.Types.ObjectId.isValid(subscriptionId)) {
            return null;
        }
        return await this.subscriptionPlanModel
            .findByIdAndUpdate(planId, { $addToSet: { subscriptions: new mongoose_2.Types.ObjectId(subscriptionId) } }, { new: true })
            .populate('subscriptions')
            .exec();
    }
    async removeSubscription(planId, subscriptionId) {
        if (!mongoose_2.Types.ObjectId.isValid(planId) ||
            !mongoose_2.Types.ObjectId.isValid(subscriptionId)) {
            return null;
        }
        return await this.subscriptionPlanModel
            .findByIdAndUpdate(planId, { $pull: { subscriptions: new mongoose_2.Types.ObjectId(subscriptionId) } }, { new: true })
            .populate('subscriptions')
            .exec();
    }
    async getStatistics() {
        const stats = await this.subscriptionPlanModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalPlans: { $sum: 1 },
                    activePlans: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
                    },
                    inactivePlans: {
                        $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] },
                    },
                    totalSubscriptions: {
                        $sum: { $size: '$subscriptions' },
                    },
                    averagePrice: { $avg: '$price' },
                },
            },
        ]);
        const plansByType = await this.subscriptionPlanModel.aggregate([
            { $group: { _id: '$planType', count: { $sum: 1 } } },
        ]);
        const plansByBillingCycle = await this.subscriptionPlanModel.aggregate([
            { $group: { _id: '$billingCycle', count: { $sum: 1 } } },
        ]);
        const plansByTypeObj = Object.values(subscription_plan_schema_1.PlanType).reduce((acc, type) => {
            acc[type] = 0;
            return acc;
        }, {});
        const plansByBillingCycleObj = Object.values(subscription_plan_schema_1.BillingCycle).reduce((acc, cycle) => {
            acc[cycle] = 0;
            return acc;
        }, {});
        plansByType.forEach((item) => {
            plansByTypeObj[item._id] = item.count;
        });
        plansByBillingCycle.forEach((item) => {
            plansByBillingCycleObj[item._id] = item.count;
        });
        return {
            totalPlans: stats[0]?.totalPlans || 0,
            activePlans: stats[0]?.activePlans || 0,
            inactivePlans: stats[0]?.inactivePlans || 0,
            plansByType: plansByTypeObj,
            plansByBillingCycle: plansByBillingCycleObj,
            totalSubscriptions: stats[0]?.totalSubscriptions || 0,
            averagePrice: stats[0]?.averagePrice || 0,
        };
    }
    async deactivatePlan(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.subscriptionPlanModel
            .findByIdAndUpdate(id, { isActive: false }, { new: true })
            .exec();
    }
    async activatePlan(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.subscriptionPlanModel
            .findByIdAndUpdate(id, { isActive: true }, { new: true })
            .exec();
    }
    async updateSortOrder(planUpdates) {
        try {
            const bulkOps = planUpdates
                .filter((update) => mongoose_2.Types.ObjectId.isValid(update.id))
                .map((update) => ({
                updateOne: {
                    filter: { _id: new mongoose_2.Types.ObjectId(update.id) },
                    update: { sortOrder: update.sortOrder },
                },
            }));
            if (bulkOps.length === 0) {
                return false;
            }
            await this.subscriptionPlanModel.bulkWrite(bulkOps);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
exports.SubscriptionPlanRepository = SubscriptionPlanRepository;
exports.SubscriptionPlanRepository = SubscriptionPlanRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_plan_schema_1.SubscriptionPlan.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], SubscriptionPlanRepository);
//# sourceMappingURL=subscription-plan.repository.js.map
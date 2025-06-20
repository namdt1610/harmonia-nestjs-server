import { Model } from 'mongoose';
import { SubscriptionPlan, SubscriptionPlanDocument, PlanType, BillingCycle } from '../schemas/subscription-plan.schema';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
export declare class SubscriptionPlanRepository {
    private subscriptionPlanModel;
    constructor(subscriptionPlanModel: Model<SubscriptionPlanDocument>);
    create(createSubscriptionPlanDto: CreateSubscriptionPlanDto): Promise<SubscriptionPlan>;
    findAll(page?: number, limit?: number, filters?: {
        planType?: PlanType;
        billingCycle?: BillingCycle;
        isActive?: boolean;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{
        plans: SubscriptionPlan[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<SubscriptionPlan | null>;
    findByPlanType(planType: PlanType): Promise<SubscriptionPlan[]>;
    findActivePlans(): Promise<SubscriptionPlan[]>;
    findByBillingCycle(billingCycle: BillingCycle): Promise<SubscriptionPlan[]>;
    findMostPopular(limit?: number): Promise<SubscriptionPlan[]>;
    update(id: string, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto): Promise<SubscriptionPlan | null>;
    delete(id: string): Promise<boolean>;
    addSubscription(planId: string, subscriptionId: string): Promise<SubscriptionPlan | null>;
    removeSubscription(planId: string, subscriptionId: string): Promise<SubscriptionPlan | null>;
    getStatistics(): Promise<{
        totalPlans: number;
        activePlans: number;
        inactivePlans: number;
        plansByType: Record<PlanType, number>;
        plansByBillingCycle: Record<BillingCycle, number>;
        totalSubscriptions: number;
        averagePrice: number;
    }>;
    deactivatePlan(id: string): Promise<SubscriptionPlan | null>;
    activatePlan(id: string): Promise<SubscriptionPlan | null>;
    updateSortOrder(planUpdates: {
        id: string;
        sortOrder: number;
    }[]): Promise<boolean>;
}

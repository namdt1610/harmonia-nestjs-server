import { PlanType, BillingCycle, AudioQuality } from '../../schemas/subscription-plan.schema';
export declare class UpdateSubscriptionPlanDto {
    name?: string;
    planType?: PlanType;
    billingCycle?: BillingCycle;
    price?: number;
    currency?: string;
    maxOfflineTracks?: number;
    audioQuality?: AudioQuality;
    adsFree?: boolean;
    skipLimit?: number;
    canDownload?: boolean;
    canCreatePlaylists?: boolean;
    maxPlaylists?: number;
    familyAccounts?: number;
    canUploadMusic?: boolean;
    analyticsAccess?: boolean;
    prioritySupport?: boolean;
    description?: string;
    featuresList?: string[];
    isActive?: boolean;
    sortOrder?: number;
}

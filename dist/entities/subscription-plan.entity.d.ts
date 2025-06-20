import { UserSubscription } from './user-subscription.entity';
export declare enum PlanType {
    FREE = "FREE",
    PREMIUM = "PREMIUM",
    FAMILY = "FAMILY",
    STUDENT = "STUDENT",
    ARTIST = "ARTIST"
}
export declare enum BillingCycle {
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
    LIFETIME = "LIFETIME"
}
export declare enum AudioQuality {
    STANDARD = "STANDARD",
    HIGH = "HIGH",
    LOSSLESS = "LOSSLESS"
}
export declare class SubscriptionPlan {
    id: string;
    name: string;
    planType: PlanType;
    billingCycle: BillingCycle;
    price: number;
    currency: string;
    maxOfflineTracks: number;
    audioQuality: AudioQuality;
    adsFree: boolean;
    skipLimit: number;
    canDownload: boolean;
    canCreatePlaylists: boolean;
    maxPlaylists: number;
    familyAccounts: number;
    canUploadMusic: boolean;
    analyticsAccess: boolean;
    prioritySupport: boolean;
    description?: string;
    featuresList: string[];
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    subscriptions: UserSubscription[];
    get monthlyPrice(): number;
}

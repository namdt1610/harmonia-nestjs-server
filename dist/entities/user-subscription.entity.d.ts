import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    TRIAL = "TRIAL",
    PAUSED = "PAUSED",
    PENDING = "PENDING"
}
export declare class UserSubscription {
    id: string;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    trialEndDate?: Date;
    autoRenew: boolean;
    paymentMethod?: string;
    externalSubscriptionId?: string;
    offlineTracksDownloaded: number;
    playlistsCreated: number;
    skipsUsedToday: number;
    lastSkipReset: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    plan: SubscriptionPlan;
    get isActive(): boolean;
    get isTrial(): boolean;
    get daysRemaining(): number;
    canSkipTracks(): boolean;
    useSkip(): boolean;
    canDownloadTracks(): boolean;
    canCreatePlaylist(): boolean;
}

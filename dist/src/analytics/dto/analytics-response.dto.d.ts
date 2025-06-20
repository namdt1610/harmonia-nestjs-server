import { ActivityType } from '../../schemas/user-activity.schema';
declare class UserInfo {
    id: string;
    username: string;
    email: string;
}
declare class TrackInfo {
    id: string;
    title: string;
    artist: any;
    album: any;
}
export declare class UserActivityResponseDto {
    id: string;
    activityType: ActivityType;
    metadata: any;
    ipAddress: string;
    userAgent: string;
    user: UserInfo;
    track?: TrackInfo;
    createdAt: Date;
}
export declare class AnalyticsStatsResponseDto {
    totalActivities: number;
    uniqueUsers: number;
    activitiesByType: Record<ActivityType, number>;
    mostActiveUsers: Array<{
        userId: string;
        username: string;
        activityCount: number;
    }>;
    mostPlayedTracks: Array<{
        trackId: string;
        title: string;
        playCount: number;
    }>;
    activityTimeline: Array<{
        date: string;
        count: number;
    }>;
    peakHours: Array<{
        hour: number;
        count: number;
    }>;
}
export declare class UserAnalyticsResponseDto {
    user: UserInfo;
    totalActivities: number;
    activitiesByType: Record<ActivityType, number>;
    mostPlayedTracks: Array<{
        trackId: string;
        title: string;
        playCount: number;
    }>;
    activityTimeline: Array<{
        date: string;
        count: number;
    }>;
    listeningPatterns: Array<{
        hour: number;
        count: number;
    }>;
    firstActivityDate: Date;
    lastActivityDate: Date;
}
export {};

import { Model } from 'mongoose';
import { UserActivity, UserActivityDocument, ActivityType } from '../schemas/user-activity.schema';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
export declare class AnalyticsRepository {
    private userActivityModel;
    constructor(userActivityModel: Model<UserActivityDocument>);
    create(createUserActivityDto: CreateUserActivityDto): Promise<UserActivity>;
    findAll(page?: number, limit?: number, filters?: {
        userId?: string;
        activityType?: ActivityType;
        startDate?: Date;
        endDate?: Date;
        trackId?: string;
    }): Promise<{
        activities: UserActivity[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<UserActivity | null>;
    findByUser(userId: string, activityType?: ActivityType, page?: number, limit?: number): Promise<{
        activities: UserActivity[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    trackActivity(userId: string, activityType: ActivityType, trackId?: string, metadata?: any, ipAddress?: string, userAgent?: string): Promise<UserActivity>;
    getGlobalStatistics(startDate?: Date, endDate?: Date): Promise<{
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
    }>;
    getUserAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<{
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
        firstActivityDate: Date | null;
        lastActivityDate: Date | null;
    }>;
    getTopTracks(limit?: number, startDate?: Date, endDate?: Date): Promise<Array<{
        trackId: string;
        title: string;
        playCount: number;
    }>>;
    delete(id: string): Promise<boolean>;
    deleteUserActivities(userId: string): Promise<boolean>;
}

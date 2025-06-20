import { Types } from 'mongoose';
import { ActivityType } from '../../schemas/user-activity.schema';
export declare class CreateUserActivityDto {
    activityType: ActivityType;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    user: Types.ObjectId;
    track?: Types.ObjectId;
}

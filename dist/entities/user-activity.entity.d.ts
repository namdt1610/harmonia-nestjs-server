import { User } from './user.entity';
import { Track } from './track.entity';
export declare enum ActivityType {
    PLAY = "PLAY",
    DOWNLOAD = "DOWNLOAD",
    LIKE = "LIKE",
    SKIP = "SKIP",
    SHARE = "SHARE",
    PLAYLIST_CREATE = "PLAYLIST_CREATE",
    PLAYLIST_ADD = "PLAYLIST_ADD",
    SEARCH = "SEARCH"
}
export declare class UserActivity {
    id: string;
    activityType: ActivityType;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    user: User;
    track?: Track;
}

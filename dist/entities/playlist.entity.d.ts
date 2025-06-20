import { User } from './user.entity';
import { Track } from './track.entity';
export declare class Playlist {
    id: string;
    name: string;
    isPublic: boolean;
    followers: number;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    tracks: Track[];
}

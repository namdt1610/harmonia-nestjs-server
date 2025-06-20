import { Track } from './track.entity';
export declare class Genre {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    tracks: Track[];
}

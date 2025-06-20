import { Track } from './track.entity';
import { Album } from './album.entity';
export declare class Artist {
    id: string;
    name: string;
    bio?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    tracks: Track[];
    albums: Album[];
}

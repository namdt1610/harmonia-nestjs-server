import { Artist } from './artist.entity';
import { Track } from './track.entity';
export declare class Album {
    id: string;
    title: string;
    releaseDate?: Date;
    image?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    artist: Artist;
    tracks: Track[];
}

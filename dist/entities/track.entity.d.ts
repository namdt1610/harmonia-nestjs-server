import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Genre } from './genre.entity';
import { Playlist } from './playlist.entity';
export declare class Track {
    id: string;
    title: string;
    file?: string;
    video?: string;
    image?: string;
    videoThumbnail?: string;
    duration?: number;
    lyrics?: string;
    playCount: number;
    downloadCount: number;
    isDownloadable: boolean;
    createdAt: Date;
    updatedAt: Date;
    artist: Artist;
    album?: Album;
    genres: Genre[];
    playlists: Playlist[];
    incrementPlayCount(): void;
    incrementDownloadCount(): void;
}

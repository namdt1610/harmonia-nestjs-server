import { Model } from 'mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { ArtistDocument } from '../schemas/artist.schema';
import { AlbumDocument } from '../schemas/album.schema';
import { GenreDocument } from '../schemas/genre.schema';
export interface CreateTrackDto {
    title: string;
    artistId: string;
    albumId?: string;
    file?: string;
    video?: string;
    image?: string;
    videoThumbnail?: string;
    duration?: number;
    lyrics?: string;
    genreIds?: string[];
    isDownloadable?: boolean;
}
export interface UpdateTrackDto {
    title?: string;
    file?: string;
    video?: string;
    image?: string;
    videoThumbnail?: string;
    duration?: number;
    lyrics?: string;
    genreIds?: string[];
    isDownloadable?: boolean;
}
export interface TrackQueryParams {
    search?: string;
    artistId?: string;
    albumId?: string;
    genreId?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'title' | 'playCount' | 'createdAt' | 'downloadCount';
    sortOrder?: 'asc' | 'desc';
}
export declare class TracksService {
    private trackModel;
    private artistModel;
    private albumModel;
    private genreModel;
    constructor(trackModel: Model<TrackDocument>, artistModel: Model<ArtistDocument>, albumModel: Model<AlbumDocument>, genreModel: Model<GenreDocument>);
    create(createTrackDto: CreateTrackDto): Promise<Track>;
    findAll(queryParams?: TrackQueryParams): Promise<{
        tracks: Track[];
        total: number;
    }>;
    findById(id: string): Promise<Track>;
    update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track>;
    remove(id: string): Promise<void>;
    incrementPlayCount(id: string): Promise<Track>;
    incrementDownloadCount(id: string): Promise<Track>;
    getPopularTracks(limit?: number): Promise<Track[]>;
    getRecentTracks(limit?: number): Promise<Track[]>;
    getTracksByArtist(artistId: string, limit?: number): Promise<Track[]>;
    getTracksByAlbum(albumId: string): Promise<Track[]>;
    searchTracks(query: string, limit?: number): Promise<Track[]>;
}

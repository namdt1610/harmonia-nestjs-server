import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Album, AlbumDocument } from '../schemas/album.schema';
export interface CreateArtistDto {
    name: string;
    bio?: string;
    image?: string;
}
export interface UpdateArtistDto {
    name?: string;
    bio?: string;
    image?: string;
}
export interface ArtistQueryParams {
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export declare class ArtistsService {
    private artistModel;
    private trackModel;
    private albumModel;
    constructor(artistModel: Model<ArtistDocument>, trackModel: Model<TrackDocument>, albumModel: Model<AlbumDocument>);
    create(createArtistDto: CreateArtistDto): Promise<Artist>;
    findAll(queryParams?: ArtistQueryParams): Promise<{
        artists: Artist[];
        total: number;
    }>;
    findById(id: string): Promise<Artist>;
    findByIdWithDetails(id: string): Promise<Artist & {
        tracksCount: number;
        albumsCount: number;
    }>;
    update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist>;
    remove(id: string): Promise<void>;
    getPopularArtists(limit?: number): Promise<Artist[]>;
    searchArtists(query: string, limit?: number): Promise<Artist[]>;
    getArtistTracks(id: string, limit?: number): Promise<Track[]>;
    getArtistAlbums(id: string): Promise<Album[]>;
    getArtistStats(id: string): Promise<{
        tracksCount: number;
        albumsCount: number;
        totalPlays: number;
        totalDownloads: number;
    }>;
}

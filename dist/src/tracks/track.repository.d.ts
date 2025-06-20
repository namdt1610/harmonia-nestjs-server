import { Model } from 'mongoose';
import { TrackDocument } from '../schemas/track.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
export declare class TrackRepository {
    private trackModel;
    constructor(trackModel: Model<TrackDocument>);
    create(createTrackDto: CreateTrackDto): Promise<TrackDocument>;
    findAll(page?: number, limit?: number, search?: string, artistId?: string, albumId?: string, genreId?: string): Promise<{
        tracks: TrackDocument[];
        total: number;
    }>;
    findById(id: string): Promise<TrackDocument | null>;
    findByIds(ids: string[]): Promise<TrackDocument[]>;
    findByArtist(artistId: string): Promise<TrackDocument[]>;
    findByAlbum(albumId: string): Promise<TrackDocument[]>;
    findByGenre(genreId: string): Promise<TrackDocument[]>;
    findPopular(limit?: number): Promise<TrackDocument[]>;
    findRecent(limit?: number): Promise<TrackDocument[]>;
    update(id: string, updateTrackDto: UpdateTrackDto): Promise<TrackDocument | null>;
    delete(id: string): Promise<TrackDocument | null>;
    incrementPlayCount(id: string): Promise<TrackDocument | null>;
    incrementDownloadCount(id: string): Promise<TrackDocument | null>;
    search(query: string, limit?: number): Promise<TrackDocument[]>;
}

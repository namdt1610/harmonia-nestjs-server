import { Model } from 'mongoose';
import { AlbumDocument } from '../schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
export declare class AlbumRepository {
    private albumModel;
    constructor(albumModel: Model<AlbumDocument>);
    create(createAlbumDto: CreateAlbumDto): Promise<AlbumDocument>;
    findAll(page?: number, limit?: number, search?: string, artistId?: string): Promise<{
        albums: AlbumDocument[];
        total: number;
    }>;
    findById(id: string): Promise<AlbumDocument | null>;
    findByTitle(title: string): Promise<AlbumDocument | null>;
    findByArtist(artistId: string): Promise<AlbumDocument[]>;
    findByIds(ids: string[]): Promise<AlbumDocument[]>;
    findPopular(limit?: number): Promise<AlbumDocument[]>;
    findRecent(limit?: number): Promise<AlbumDocument[]>;
    findNewReleases(limit?: number): Promise<AlbumDocument[]>;
    update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<AlbumDocument | null>;
    delete(id: string): Promise<AlbumDocument | null>;
    addTrack(albumId: string, trackId: string): Promise<AlbumDocument | null>;
    removeTrack(albumId: string, trackId: string): Promise<AlbumDocument | null>;
    search(query: string, limit?: number): Promise<AlbumDocument[]>;
    getAlbumStats(albumId: string): Promise<any>;
}

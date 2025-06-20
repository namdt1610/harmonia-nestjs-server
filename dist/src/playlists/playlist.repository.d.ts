import { Model } from 'mongoose';
import { PlaylistDocument } from '../schemas/playlist.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
export declare class PlaylistRepository {
    private playlistModel;
    constructor(playlistModel: Model<PlaylistDocument>);
    create(createPlaylistDto: CreatePlaylistDto): Promise<PlaylistDocument>;
    findAll(page?: number, limit?: number, search?: string, isPublic?: boolean, userId?: string): Promise<{
        playlists: PlaylistDocument[];
        total: number;
    }>;
    findById(id: string): Promise<PlaylistDocument | null>;
    findByUser(userId: string): Promise<PlaylistDocument[]>;
    addTrack(playlistId: string, trackId: string): Promise<PlaylistDocument | null>;
    removeTrack(playlistId: string, trackId: string): Promise<PlaylistDocument | null>;
    update(id: string, updatePlaylistDto: UpdatePlaylistDto): Promise<PlaylistDocument | null>;
    delete(id: string): Promise<PlaylistDocument | null>;
    search(query: string, limit?: number): Promise<PlaylistDocument[]>;
}

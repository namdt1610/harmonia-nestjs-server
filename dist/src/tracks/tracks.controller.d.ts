import { TracksService, CreateTrackDto, UpdateTrackDto, TrackQueryParams } from './tracks.service';
import { Track } from '../schemas/track.schema';
export declare class TracksController {
    private readonly tracksService;
    constructor(tracksService: TracksService);
    create(createTrackDto: CreateTrackDto, files?: Express.Multer.File[]): Promise<Track>;
    findAll(queryParams: TrackQueryParams): Promise<{
        tracks: Track[];
        total: number;
    }>;
    getPopular(limit?: string): Promise<Track[]>;
    getRecent(limit?: string): Promise<Track[]>;
    search(query: string, limit?: string): Promise<Track[]>;
    getByArtist(artistId: string, limit?: string): Promise<Track[]>;
    getByAlbum(albumId: string): Promise<Track[]>;
    findOne(id: string): Promise<Track>;
    update(id: string, updateTrackDto: UpdateTrackDto, files?: Express.Multer.File[]): Promise<Track>;
    remove(id: string): Promise<void>;
    play(id: string): Promise<Track>;
    download(id: string): Promise<Track>;
}

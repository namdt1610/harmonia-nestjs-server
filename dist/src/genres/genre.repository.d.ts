import { Model } from 'mongoose';
import { GenreDocument } from '../schemas/genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenreRepository {
    private genreModel;
    constructor(genreModel: Model<GenreDocument>);
    create(createGenreDto: CreateGenreDto): Promise<GenreDocument>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        genres: GenreDocument[];
        total: number;
    }>;
    findById(id: string): Promise<GenreDocument | null>;
    findByName(name: string): Promise<GenreDocument | null>;
    findByIds(ids: string[]): Promise<GenreDocument[]>;
    findPopular(limit?: number): Promise<GenreDocument[]>;
    update(id: string, updateGenreDto: UpdateGenreDto): Promise<GenreDocument | null>;
    delete(id: string): Promise<GenreDocument | null>;
    addTrack(genreId: string, trackId: string): Promise<GenreDocument | null>;
    removeTrack(genreId: string, trackId: string): Promise<GenreDocument | null>;
    search(query: string, limit?: number): Promise<GenreDocument[]>;
    getGenreStats(genreId: string): Promise<any>;
}

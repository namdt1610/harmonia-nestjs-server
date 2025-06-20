import { PrismaService } from '../common/prisma.service';
import { Artist, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
type ArtistWithRelations = Prisma.ArtistGetPayload<{
    include: {
        albums: true;
        tracks: true;
        followers: {
            include: {
                user: true;
            };
        };
    };
}>;
export declare class ArtistRepository extends BaseRepository<Artist> {
    constructor(prisma: PrismaService);
    create(createArtistDto: CreateArtistDto): Promise<Artist>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        artists: Artist[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<ArtistWithRelations | null>;
    findByName(name: string): Promise<Artist | null>;
    findByIds(ids: string[]): Promise<Artist[]>;
    findPopular(limit?: number): Promise<any[]>;
    findRecent(limit?: number): Promise<Artist[]>;
    update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist | null>;
    delete(id: string): Promise<Artist | null>;
    search(query: string, limit?: number): Promise<Artist[]>;
    getArtistStats(artistId: string): Promise<any>;
    getTopTracks(artistId: string, limit?: number): Promise<any[]>;
    getAlbums(artistId: string): Promise<any[]>;
    addFollower(artistId: string, userId: string): Promise<boolean>;
    removeFollower(artistId: string, userId: string): Promise<boolean>;
    isFollowing(artistId: string, userId: string): Promise<boolean>;
    getFollowers(artistId: string, page?: number, limit?: number): Promise<any>;
}
export {};

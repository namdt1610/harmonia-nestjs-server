import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ArtistRepository } from './artist.repository';
import { TrackRepository } from '../tracks/track.repository';
import { AlbumRepository } from '../albums/album.repository';

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

@Injectable()
export class ArtistsService {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly trackRepository: TrackRepository,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<any> {
    // Check if artist with same name already exists using repository search
    const existingArtists = await this.artistRepository.findAll(
      1,
      1,
      createArtistDto.name,
    );

    if (existingArtists.artists.length > 0) {
      throw new BadRequestException('Artist with this name already exists');
    }

    return this.artistRepository.create(createArtistDto);
  }

  async findAll(
    queryParams: ArtistQueryParams = {},
  ): Promise<{ artists: any[]; total: number }> {
    const {
      search,
      limit = 20,
      offset = 0,
      sortBy = 'name',
      sortOrder = 'asc',
    } = queryParams;

    // Convert offset to page number for repository
    const page = Math.floor(offset / limit) + 1;

    const result = await this.artistRepository.findAll(
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    );

    return {
      artists: result.artists,
      total: result.total,
    };
  }

  async findById(id: string): Promise<any> {
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async findByIdWithDetails(id: string): Promise<any> {
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Get tracks and albums count using repositories
    const [tracksResult, albumsResult] = await Promise.all([
      this.trackRepository.findAll(1, 1, undefined, id, undefined, undefined),
      this.albumRepository.findAll(1, 1, { artistId: id }),
    ]);

    return {
      ...artist,
      tracksCount: tracksResult.total,
      albumsCount: albumsResult.total,
    };
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<any> {
    // Check if another artist with same name exists
    if (updateArtistDto.name) {
      const existingArtists = await this.artistRepository.findAll(
        1,
        1,
        updateArtistDto.name,
      );

      if (
        existingArtists.artists.length > 0 &&
        existingArtists.artists[0].id !== id
      ) {
        throw new BadRequestException('Artist with this name already exists');
      }
    }

    const artist = await this.artistRepository.update(id, updateArtistDto);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Check if artist has tracks or albums using repositories
    const [tracksResult, albumsResult] = await Promise.all([
      this.trackRepository.findAll(1, 1, undefined, id, undefined, undefined),
      this.albumRepository.findAll(1, 1, { artistId: id }),
    ]);

    if (tracksResult.total > 0 || albumsResult.total > 0) {
      throw new BadRequestException(
        'Cannot delete artist with existing tracks or albums',
      );
    }

    const deleted = await this.artistRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Artist not found');
    }
  }

  async getPopularArtists(limit: number = 10): Promise<any[]> {
    return this.artistRepository.findPopular(limit);
  }

  async searchArtists(query: string, limit: number = 20): Promise<any[]> {
    const result = await this.artistRepository.findAll(
      1,
      limit,
      query,
      'name',
      'asc',
    );
    return result.artists;
  }

  async getArtistTracks(id: string, limit: number = 20): Promise<any[]> {
    // Validate artist exists
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const tracks = await this.trackRepository.findByArtist(id);
    return tracks.slice(0, limit);
  }

  async getArtistAlbums(id: string): Promise<any[]> {
    // Validate artist exists
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const result = await this.albumRepository.findAll(1, 100, { artistId: id });
    return result.albums;
  }

  async getArtistStats(id: string): Promise<{
    tracksCount: number;
    albumsCount: number;
    totalPlays: number;
    totalDownloads: number;
  }> {
    // Validate artist exists
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return this.artistRepository.getStatistics(id);
  }
}

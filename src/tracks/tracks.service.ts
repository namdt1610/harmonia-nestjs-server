import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { TrackRepository } from './track.repository';
import { ArtistRepository } from '../artists/artist.repository';
import { AlbumRepository } from '../albums/album.repository';
import { GenreRepository } from '../genres/genre.repository';

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

@Injectable()
export class TracksService {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<any> {
    // Validate artist exists
    const artist = await this.artistRepository.findById(
      createTrackDto.artistId,
    );
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Validate album exists if provided
    if (createTrackDto.albumId) {
      const album = await this.albumRepository.findById(createTrackDto.albumId);
      if (!album) {
        throw new NotFoundException('Album not found');
      }
    }

    // Validate genres if provided
    if (createTrackDto.genreIds && createTrackDto.genreIds.length > 0) {
      for (const genreId of createTrackDto.genreIds) {
        const genre = await this.genreRepository.findById(genreId);
        if (!genre) {
          throw new NotFoundException(`Genre with ID ${genreId} not found`);
        }
      }
    }

    // Create track using repository - map fields to match repository interface
    return this.trackRepository.create({
      title: createTrackDto.title,
      artist: createTrackDto.artistId,
      album: createTrackDto.albumId,
      file: createTrackDto.file,
      video: createTrackDto.video,
      image: createTrackDto.image,
      videoThumbnail: createTrackDto.videoThumbnail,
      duration: createTrackDto.duration,
      lyrics: createTrackDto.lyrics,
      genres: createTrackDto.genreIds || [],
      isDownloadable: createTrackDto.isDownloadable ?? true,
    });
  }

  async findAll(
    queryParams: TrackQueryParams = {},
  ): Promise<{ tracks: any[]; total: number }> {
    const {
      search,
      artistId,
      albumId,
      genreId,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryParams;

    // Convert offset to page number for repository
    const page = Math.floor(offset / limit) + 1;

    const result = await this.trackRepository.findAll(
      page,
      limit,
      search,
      artistId,
      albumId,
      genreId,
    );

    return {
      tracks: result.tracks,
      total: result.total,
    };
  }

  async findById(id: string): Promise<any> {
    const track = await this.trackRepository.findById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<any> {
    // Validate genres if provided
    if (updateTrackDto.genreIds && updateTrackDto.genreIds.length > 0) {
      for (const genreId of updateTrackDto.genreIds) {
        const genre = await this.genreRepository.findById(genreId);
        if (!genre) {
          throw new NotFoundException(`Genre with ID ${genreId} not found`);
        }
      }
    }

    const track = await this.trackRepository.update(id, updateTrackDto);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.trackRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Track not found');
    }
  }

  async incrementPlayCount(id: string): Promise<any> {
    const track = await this.trackRepository.incrementPlayCount(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async incrementDownloadCount(id: string): Promise<any> {
    const track = await this.trackRepository.incrementDownloadCount(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async getPopularTracks(limit: number = 10): Promise<any[]> {
    return this.trackRepository.findPopular(limit);
  }

  async getRecentTracks(limit: number = 10): Promise<any[]> {
    return this.trackRepository.findRecent(limit);
  }

  async getTracksByArtist(
    artistId: string,
    limit: number = 20,
  ): Promise<any[]> {
    // Validate artist exists
    const artist = await this.artistRepository.findById(artistId);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const tracks = await this.trackRepository.findByArtist(artistId);
    // Apply limit manually since repository method doesn't support it
    return tracks.slice(0, limit);
  }

  async getTracksByAlbum(albumId: string): Promise<any[]> {
    // Validate album exists
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return this.trackRepository.findByAlbum(albumId);
  }

  async searchTracks(query: string, limit: number = 20): Promise<any[]> {
    const result = await this.trackRepository.findAll(
      1,
      limit,
      query,
      undefined,
      undefined,
      undefined,
    );
    return result.tracks;
  }
}

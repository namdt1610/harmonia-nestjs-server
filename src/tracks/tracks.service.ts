import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Track, TrackDocument } from '../schemas/track.schema';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Genre, GenreDocument } from '../schemas/genre.schema';

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
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    // Validate artist exists
    const artist = await this.artistModel.findById(createTrackDto.artistId);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Validate album exists if provided
    if (createTrackDto.albumId) {
      const album = await this.albumModel.findById(createTrackDto.albumId);
      if (!album) {
        throw new NotFoundException('Album not found');
      }
    }

    // Create track
    const track = new this.trackModel({
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

    const savedTrack = await track.save();

    // Update artist's tracks
    await this.artistModel.findByIdAndUpdate(createTrackDto.artistId, {
      $push: { tracks: savedTrack._id },
    });

    // Update album's tracks if album is provided
    if (createTrackDto.albumId) {
      await this.albumModel.findByIdAndUpdate(createTrackDto.albumId, {
        $push: { tracks: savedTrack._id },
      });
    }

    return savedTrack.populate(['artist', 'album', 'genres']);
  }

  async findAll(
    queryParams: TrackQueryParams = {},
  ): Promise<{ tracks: Track[]; total: number }> {
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

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { lyrics: { $regex: search, $options: 'i' } },
      ];
    }

    if (artistId) {
      query.artist = artistId;
    }

    if (albumId) {
      query.album = albumId;
    }

    if (genreId) {
      query.genres = genreId;
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [tracks, total] = await Promise.all([
      this.trackModel
        .find(query)
        .populate('artist', 'name image')
        .populate('album', 'title image')
        .populate('genres', 'name')
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .exec(),
      this.trackModel.countDocuments(query),
    ]);

    return { tracks, total };
  }

  async findById(id: string): Promise<Track> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const track = await this.trackModel
      .findById(id)
      .populate('artist', 'name image bio')
      .populate('album', 'title image releaseDate')
      .populate('genres', 'name description')
      .exec();

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackModel
      .findByIdAndUpdate(id, updateTrackDto, { new: true })
      .populate(['artist', 'album', 'genres'])
      .exec();

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async remove(id: string): Promise<void> {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // Remove from artist's tracks
    await this.artistModel.findByIdAndUpdate(track.artist, {
      $pull: { tracks: id },
    });

    // Remove from album's tracks if album exists
    if (track.album) {
      await this.albumModel.findByIdAndUpdate(track.album, {
        $pull: { tracks: id },
      });
    }

    await this.trackModel.findByIdAndDelete(id);
  }

  async incrementPlayCount(id: string): Promise<Track> {
    const track = await this.trackModel
      .findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true })
      .populate(['artist', 'album', 'genres'])
      .exec();

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async incrementDownloadCount(id: string): Promise<Track> {
    const track = await this.trackModel
      .findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true })
      .populate(['artist', 'album', 'genres'])
      .exec();

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async getPopularTracks(limit: number = 10): Promise<Track[]> {
    return this.trackModel
      .find()
      .populate('artist', 'name image')
      .populate('album', 'title image')
      .sort({ playCount: -1 })
      .limit(limit)
      .exec();
  }

  async getRecentTracks(limit: number = 10): Promise<Track[]> {
    return this.trackModel
      .find()
      .populate('artist', 'name image')
      .populate('album', 'title image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getTracksByArtist(
    artistId: string,
    limit: number = 20,
  ): Promise<Track[]> {
    return this.trackModel
      .find({ artist: artistId })
      .populate('album', 'title image')
      .populate('genres', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getTracksByAlbum(albumId: string): Promise<Track[]> {
    return this.trackModel
      .find({ album: albumId })
      .populate('artist', 'name image')
      .populate('genres', 'name')
      .sort({ createdAt: 1 })
      .exec();
  }

  async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    return this.trackModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { lyrics: { $regex: query, $options: 'i' } },
        ],
      })
      .populate('artist', 'name image')
      .populate('album', 'title image')
      .populate('genres', 'name')
      .limit(limit)
      .exec();
  }
}

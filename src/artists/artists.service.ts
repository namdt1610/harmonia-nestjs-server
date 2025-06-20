import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    // Check if artist with same name already exists
    const existingArtist = await this.artistModel.findOne({
      name: { $regex: new RegExp(`^${createArtistDto.name}$`, 'i') },
    });

    if (existingArtist) {
      throw new BadRequestException('Artist with this name already exists');
    }

    const artist = new this.artistModel(createArtistDto);
    return artist.save();
  }

  async findAll(
    queryParams: ArtistQueryParams = {},
  ): Promise<{ artists: Artist[]; total: number }> {
    const {
      search,
      limit = 20,
      offset = 0,
      sortBy = 'name',
      sortOrder = 'asc',
    } = queryParams;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [artists, total] = await Promise.all([
      this.artistModel.find(query).sort(sort).skip(offset).limit(limit).exec(),
      this.artistModel.countDocuments(query),
    ]);

    return { artists, total };
  }

  async findById(id: string): Promise<Artist> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid artist ID');
    }

    const artist = await this.artistModel.findById(id).exec();

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async findByIdWithDetails(
    id: string,
  ): Promise<Artist & { tracksCount: number; albumsCount: number }> {
    const artist = await this.findById(id);

    const [tracksCount, albumsCount] = await Promise.all([
      this.trackModel.countDocuments({ artist: id }),
      this.albumModel.countDocuments({ artist: id }),
    ]);

    return {
      ...artist.toObject(),
      tracksCount,
      albumsCount,
    };
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    // Check if another artist with same name exists
    if (updateArtistDto.name) {
      const existingArtist = await this.artistModel.findOne({
        name: { $regex: new RegExp(`^${updateArtistDto.name}$`, 'i') },
        _id: { $ne: id },
      });

      if (existingArtist) {
        throw new BadRequestException('Artist with this name already exists');
      }
    }

    const artist = await this.artistModel
      .findByIdAndUpdate(id, updateArtistDto, { new: true })
      .exec();

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistModel.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Check if artist has tracks or albums
    const [tracksCount, albumsCount] = await Promise.all([
      this.trackModel.countDocuments({ artist: id }),
      this.albumModel.countDocuments({ artist: id }),
    ]);

    if (tracksCount > 0 || albumsCount > 0) {
      throw new BadRequestException(
        'Cannot delete artist with existing tracks or albums',
      );
    }

    await this.artistModel.findByIdAndDelete(id);
  }

  async getPopularArtists(limit: number = 10): Promise<Artist[]> {
    // Get artists with highest total play counts across their tracks
    const popularArtists = await this.trackModel.aggregate([
      {
        $group: {
          _id: '$artist',
          totalPlays: { $sum: '$playCount' },
          tracksCount: { $sum: 1 },
        },
      },
      { $sort: { totalPlays: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'artists',
          localField: '_id',
          foreignField: '_id',
          as: 'artist',
        },
      },
      { $unwind: '$artist' },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$artist',
              { totalPlays: '$totalPlays', tracksCount: '$tracksCount' },
            ],
          },
        },
      },
    ]);

    return popularArtists;
  }

  async searchArtists(query: string, limit: number = 20): Promise<Artist[]> {
    return this.artistModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(limit)
      .exec();
  }

  async getArtistTracks(id: string, limit: number = 20): Promise<Track[]> {
    await this.findById(id); // Verify artist exists

    return this.trackModel
      .find({ artist: id })
      .populate('album', 'title image')
      .populate('genres', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getArtistAlbums(id: string): Promise<Album[]> {
    await this.findById(id); // Verify artist exists

    return this.albumModel
      .find({ artist: id })
      .populate('tracks')
      .sort({ releaseDate: -1 })
      .exec();
  }

  async getArtistStats(id: string): Promise<{
    tracksCount: number;
    albumsCount: number;
    totalPlays: number;
    totalDownloads: number;
  }> {
    await this.findById(id); // Verify artist exists

    const [tracksCount, albumsCount, stats] = await Promise.all([
      this.trackModel.countDocuments({ artist: id }),
      this.albumModel.countDocuments({ artist: id }),
      this.trackModel.aggregate([
        { $match: { artist: new Types.ObjectId(id) } },
        {
          $group: {
            _id: null,
            totalPlays: { $sum: '$playCount' },
            totalDownloads: { $sum: '$downloadCount' },
          },
        },
      ]),
    ]);

    return {
      tracksCount,
      albumsCount,
      totalPlays: stats[0]?.totalPlays || 0,
      totalDownloads: stats[0]?.totalDownloads || 0,
    };
  }
}

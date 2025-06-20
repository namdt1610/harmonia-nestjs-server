"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const artist_schema_1 = require("../schemas/artist.schema");
const track_schema_1 = require("../schemas/track.schema");
const album_schema_1 = require("../schemas/album.schema");
let ArtistsService = class ArtistsService {
    artistModel;
    trackModel;
    albumModel;
    constructor(artistModel, trackModel, albumModel) {
        this.artistModel = artistModel;
        this.trackModel = trackModel;
        this.albumModel = albumModel;
    }
    async create(createArtistDto) {
        const existingArtist = await this.artistModel.findOne({
            name: { $regex: new RegExp(`^${createArtistDto.name}$`, 'i') },
        });
        if (existingArtist) {
            throw new common_1.BadRequestException('Artist with this name already exists');
        }
        const artist = new this.artistModel(createArtistDto);
        return artist.save();
    }
    async findAll(queryParams = {}) {
        const { search, limit = 20, offset = 0, sortBy = 'name', sortOrder = 'asc', } = queryParams;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
            ];
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const [artists, total] = await Promise.all([
            this.artistModel.find(query).sort(sort).skip(offset).limit(limit).exec(),
            this.artistModel.countDocuments(query),
        ]);
        return { artists, total };
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid artist ID');
        }
        const artist = await this.artistModel.findById(id).exec();
        if (!artist) {
            throw new common_1.NotFoundException('Artist not found');
        }
        return artist;
    }
    async findByIdWithDetails(id) {
        const artist = await this.artistModel.findById(id).lean().exec();
        if (!artist) {
            throw new common_1.NotFoundException('Artist not found');
        }
        const [tracksCount, albumsCount] = await Promise.all([
            this.trackModel.countDocuments({ artist: id }),
            this.albumModel.countDocuments({ artist: id }),
        ]);
        return {
            ...artist,
            tracksCount,
            albumsCount,
        };
    }
    async update(id, updateArtistDto) {
        if (updateArtistDto.name) {
            const existingArtist = await this.artistModel.findOne({
                name: { $regex: new RegExp(`^${updateArtistDto.name}$`, 'i') },
                _id: { $ne: id },
            });
            if (existingArtist) {
                throw new common_1.BadRequestException('Artist with this name already exists');
            }
        }
        const artist = await this.artistModel
            .findByIdAndUpdate(id, updateArtistDto, { new: true })
            .exec();
        if (!artist) {
            throw new common_1.NotFoundException('Artist not found');
        }
        return artist;
    }
    async remove(id) {
        const artist = await this.artistModel.findById(id);
        if (!artist) {
            throw new common_1.NotFoundException('Artist not found');
        }
        const [tracksCount, albumsCount] = await Promise.all([
            this.trackModel.countDocuments({ artist: id }),
            this.albumModel.countDocuments({ artist: id }),
        ]);
        if (tracksCount > 0 || albumsCount > 0) {
            throw new common_1.BadRequestException('Cannot delete artist with existing tracks or albums');
        }
        await this.artistModel.findByIdAndDelete(id);
    }
    async getPopularArtists(limit = 10) {
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
    async searchArtists(query, limit = 20) {
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
    async getArtistTracks(id, limit = 20) {
        await this.findById(id);
        return this.trackModel
            .find({ artist: id })
            .populate('album', 'title image')
            .populate('genres', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getArtistAlbums(id) {
        await this.findById(id);
        return this.albumModel
            .find({ artist: id })
            .populate('tracks')
            .sort({ releaseDate: -1 })
            .exec();
    }
    async getArtistStats(id) {
        await this.findById(id);
        const [tracksCount, albumsCount, stats] = await Promise.all([
            this.trackModel.countDocuments({ artist: id }),
            this.albumModel.countDocuments({ artist: id }),
            this.trackModel.aggregate([
                { $match: { artist: new mongoose_2.Types.ObjectId(id) } },
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
};
exports.ArtistsService = ArtistsService;
exports.ArtistsService = ArtistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(artist_schema_1.Artist.name)),
    __param(1, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __param(2, (0, mongoose_1.InjectModel)(album_schema_1.Album.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], ArtistsService);
//# sourceMappingURL=artists.service.js.map
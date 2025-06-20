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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const album_schema_1 = require("../schemas/album.schema");
let AlbumRepository = class AlbumRepository {
    albumModel;
    constructor(albumModel) {
        this.albumModel = albumModel;
    }
    async create(createAlbumDto) {
        const album = new this.albumModel({
            ...createAlbumDto,
            artist: new mongoose_2.Types.ObjectId(createAlbumDto.artist),
            releaseDate: createAlbumDto.releaseDate
                ? new Date(createAlbumDto.releaseDate)
                : undefined,
        });
        return album.save();
    }
    async findAll(page = 1, limit = 10, search, artistId) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (artistId) {
            filter.artist = new mongoose_2.Types.ObjectId(artistId);
        }
        const [albums, total] = await Promise.all([
            this.albumModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate('artist', 'name image bio')
                .populate('tracks', 'title duration playCount')
                .sort({ releaseDate: -1 })
                .exec(),
            this.albumModel.countDocuments(filter),
        ]);
        return { albums, total };
    }
    async findById(id) {
        return this.albumModel
            .findById(id)
            .populate('artist', 'name image bio')
            .populate('tracks', 'title duration playCount lyrics file')
            .exec();
    }
    async findByTitle(title) {
        return this.albumModel
            .findOne({ title })
            .populate('artist', 'name image')
            .exec();
    }
    async findByArtist(artistId) {
        return this.albumModel
            .find({ artist: new mongoose_2.Types.ObjectId(artistId) })
            .populate('tracks', 'title duration playCount')
            .sort({ releaseDate: -1 })
            .exec();
    }
    async findByIds(ids) {
        return this.albumModel
            .find({ _id: { $in: ids.map((id) => new mongoose_2.Types.ObjectId(id)) } })
            .populate('artist', 'name image')
            .populate('tracks', 'title duration')
            .exec();
    }
    async findPopular(limit = 10) {
        return this.albumModel
            .aggregate([
            {
                $lookup: {
                    from: 'tracks',
                    localField: 'tracks',
                    foreignField: '_id',
                    as: 'trackDetails',
                },
            },
            {
                $addFields: {
                    totalPlays: { $sum: '$trackDetails.playCount' },
                },
            },
            { $sort: { totalPlays: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'artists',
                    localField: 'artist',
                    foreignField: '_id',
                    as: 'artist',
                    pipeline: [{ $project: { name: 1, image: 1 } }],
                },
            },
            { $unwind: '$artist' },
            {
                $lookup: {
                    from: 'tracks',
                    localField: 'tracks',
                    foreignField: '_id',
                    as: 'tracks',
                    pipeline: [{ $project: { title: 1, duration: 1, playCount: 1 } }],
                },
            },
        ])
            .exec();
    }
    async findRecent(limit = 10) {
        return this.albumModel
            .find()
            .populate('artist', 'name image')
            .populate('tracks', 'title duration')
            .sort({ releaseDate: -1 })
            .limit(limit)
            .exec();
    }
    async findNewReleases(limit = 10) {
        return this.albumModel
            .find()
            .populate('artist', 'name image')
            .populate('tracks', 'title duration')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async update(id, updateAlbumDto) {
        const updateData = { ...updateAlbumDto };
        if (updateAlbumDto.artist) {
            updateData.artist = new mongoose_2.Types.ObjectId(updateAlbumDto.artist);
        }
        if (updateAlbumDto.releaseDate) {
            updateData.releaseDate = new Date(updateAlbumDto.releaseDate);
        }
        return this.albumModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('artist', 'name image')
            .populate('tracks', 'title duration')
            .exec();
    }
    async delete(id) {
        return this.albumModel.findByIdAndDelete(id).exec();
    }
    async addTrack(albumId, trackId) {
        return this.albumModel
            .findByIdAndUpdate(albumId, { $addToSet: { tracks: new mongoose_2.Types.ObjectId(trackId) } }, { new: true })
            .exec();
    }
    async removeTrack(albumId, trackId) {
        return this.albumModel
            .findByIdAndUpdate(albumId, { $pull: { tracks: new mongoose_2.Types.ObjectId(trackId) } }, { new: true })
            .exec();
    }
    async search(query, limit = 20) {
        return this.albumModel
            .find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ],
        })
            .populate('artist', 'name image')
            .populate('tracks', 'title duration')
            .limit(limit)
            .exec();
    }
    async getAlbumStats(albumId) {
        const result = await this.albumModel
            .aggregate([
            { $match: { _id: new mongoose_2.Types.ObjectId(albumId) } },
            {
                $lookup: {
                    from: 'tracks',
                    localField: 'tracks',
                    foreignField: '_id',
                    as: 'trackDetails',
                },
            },
            {
                $addFields: {
                    trackCount: { $size: '$tracks' },
                    totalDuration: { $sum: '$trackDetails.duration' },
                    totalPlays: { $sum: '$trackDetails.playCount' },
                    totalDownloads: { $sum: '$trackDetails.downloadCount' },
                },
            },
        ])
            .exec();
        return result[0] || null;
    }
};
exports.AlbumRepository = AlbumRepository;
exports.AlbumRepository = AlbumRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(album_schema_1.Album.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AlbumRepository);
//# sourceMappingURL=album.repository.js.map
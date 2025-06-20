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
exports.GenreRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const genre_schema_1 = require("../schemas/genre.schema");
let GenreRepository = class GenreRepository {
    genreModel;
    constructor(genreModel) {
        this.genreModel = genreModel;
    }
    async create(createGenreDto) {
        const genre = new this.genreModel(createGenreDto);
        return genre.save();
    }
    async findAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const filter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ],
            }
            : {};
        const [genres, total] = await Promise.all([
            this.genreModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate({
                path: 'tracks',
                select: 'title image playCount',
                populate: {
                    path: 'artist',
                    select: 'name image',
                },
            })
                .sort({ name: 1 })
                .exec(),
            this.genreModel.countDocuments(filter),
        ]);
        return { genres, total };
    }
    async findById(id) {
        return this.genreModel
            .findById(id)
            .populate({
            path: 'tracks',
            select: 'title image duration playCount createdAt',
            populate: {
                path: 'artist',
                select: 'name image bio',
            },
        })
            .exec();
    }
    async findByName(name) {
        return this.genreModel.findOne({ name }).exec();
    }
    async findByIds(ids) {
        return this.genreModel
            .find({ _id: { $in: ids.map((id) => new mongoose_2.Types.ObjectId(id)) } })
            .populate({
            path: 'tracks',
            select: 'title image',
            populate: {
                path: 'artist',
                select: 'name image',
            },
        })
            .exec();
    }
    async findPopular(limit = 10) {
        return this.genreModel
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
                    trackCount: { $size: '$tracks' },
                    totalPlays: { $sum: '$trackDetails.playCount' },
                },
            },
            { $sort: { totalPlays: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'tracks',
                    localField: 'tracks',
                    foreignField: '_id',
                    as: 'tracks',
                    pipeline: [
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
                        { $project: { title: 1, image: 1, artist: 1 } },
                    ],
                },
            },
        ])
            .exec();
    }
    async update(id, updateGenreDto) {
        return this.genreModel
            .findByIdAndUpdate(id, updateGenreDto, { new: true })
            .populate({
            path: 'tracks',
            select: 'title image',
            populate: {
                path: 'artist',
                select: 'name image',
            },
        })
            .exec();
    }
    async delete(id) {
        return this.genreModel.findByIdAndDelete(id).exec();
    }
    async addTrack(genreId, trackId) {
        return this.genreModel
            .findByIdAndUpdate(genreId, { $addToSet: { tracks: new mongoose_2.Types.ObjectId(trackId) } }, { new: true })
            .exec();
    }
    async removeTrack(genreId, trackId) {
        return this.genreModel
            .findByIdAndUpdate(genreId, { $pull: { tracks: new mongoose_2.Types.ObjectId(trackId) } }, { new: true })
            .exec();
    }
    async search(query, limit = 20) {
        return this.genreModel
            .find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ],
        })
            .populate({
            path: 'tracks',
            select: 'title image',
            populate: {
                path: 'artist',
                select: 'name image',
            },
        })
            .limit(limit)
            .exec();
    }
    async getGenreStats(genreId) {
        const result = await this.genreModel
            .aggregate([
            { $match: { _id: new mongoose_2.Types.ObjectId(genreId) } },
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
                    totalPlays: { $sum: '$trackDetails.playCount' },
                    totalDownloads: { $sum: '$trackDetails.downloadCount' },
                },
            },
        ])
            .exec();
        return result[0] || null;
    }
};
exports.GenreRepository = GenreRepository;
exports.GenreRepository = GenreRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(genre_schema_1.Genre.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], GenreRepository);
//# sourceMappingURL=genre.repository.js.map
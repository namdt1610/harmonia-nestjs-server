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
exports.TrackRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const track_schema_1 = require("../schemas/track.schema");
let TrackRepository = class TrackRepository {
    trackModel;
    constructor(trackModel) {
        this.trackModel = trackModel;
    }
    async create(createTrackDto) {
        const track = new this.trackModel({
            ...createTrackDto,
            artist: new mongoose_2.Types.ObjectId(createTrackDto.artist),
            album: createTrackDto.album
                ? new mongoose_2.Types.ObjectId(createTrackDto.album)
                : undefined,
            genres: createTrackDto.genres?.map((id) => new mongoose_2.Types.ObjectId(id)) || [],
        });
        return track.save();
    }
    async findAll(page = 1, limit = 10, search, artistId, albumId, genreId) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { lyrics: { $regex: search, $options: 'i' } },
            ];
        }
        if (artistId) {
            filter.artist = new mongoose_2.Types.ObjectId(artistId);
        }
        if (albumId) {
            filter.album = new mongoose_2.Types.ObjectId(albumId);
        }
        if (genreId) {
            filter.genres = new mongoose_2.Types.ObjectId(genreId);
        }
        const [tracks, total] = await Promise.all([
            this.trackModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate('artist', 'name image')
                .populate('album', 'title image')
                .populate('genres', 'name')
                .sort({ createdAt: -1 })
                .exec(),
            this.trackModel.countDocuments(filter),
        ]);
        return { tracks, total };
    }
    async findById(id) {
        return this.trackModel
            .findById(id)
            .populate('artist', 'name image bio')
            .populate('album', 'title image releaseDate')
            .populate('genres', 'name description')
            .exec();
    }
    async findByIds(ids) {
        return this.trackModel
            .find({ _id: { $in: ids.map((id) => new mongoose_2.Types.ObjectId(id)) } })
            .populate('artist', 'name image')
            .populate('album', 'title image')
            .populate('genres', 'name')
            .exec();
    }
    async findByArtist(artistId) {
        return this.trackModel
            .find({ artist: new mongoose_2.Types.ObjectId(artistId) })
            .populate('album', 'title image')
            .populate('genres', 'name')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByAlbum(albumId) {
        return this.trackModel
            .find({ album: new mongoose_2.Types.ObjectId(albumId) })
            .populate('artist', 'name image')
            .populate('genres', 'name')
            .sort({ createdAt: 1 })
            .exec();
    }
    async findByGenre(genreId) {
        return this.trackModel
            .find({ genres: new mongoose_2.Types.ObjectId(genreId) })
            .populate('artist', 'name image')
            .populate('album', 'title image')
            .sort({ playCount: -1 })
            .exec();
    }
    async findPopular(limit = 10) {
        return this.trackModel
            .find()
            .populate('artist', 'name image')
            .populate('album', 'title image')
            .populate('genres', 'name')
            .sort({ playCount: -1 })
            .limit(limit)
            .exec();
    }
    async findRecent(limit = 10) {
        return this.trackModel
            .find()
            .populate('artist', 'name image')
            .populate('album', 'title image')
            .populate('genres', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async update(id, updateTrackDto) {
        const updateData = { ...updateTrackDto };
        if (updateTrackDto.artist) {
            updateData.artist = new mongoose_2.Types.ObjectId(updateTrackDto.artist);
        }
        if (updateTrackDto.album) {
            updateData.album = new mongoose_2.Types.ObjectId(updateTrackDto.album);
        }
        if (updateTrackDto.genres) {
            updateData.genres = updateTrackDto.genres.map((id) => new mongoose_2.Types.ObjectId(id));
        }
        return this.trackModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('artist', 'name image')
            .populate('album', 'title image')
            .populate('genres', 'name')
            .exec();
    }
    async delete(id) {
        return this.trackModel.findByIdAndDelete(id).exec();
    }
    async incrementPlayCount(id) {
        return this.trackModel
            .findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true })
            .exec();
    }
    async incrementDownloadCount(id) {
        return this.trackModel
            .findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true })
            .exec();
    }
    async search(query, limit = 20) {
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
};
exports.TrackRepository = TrackRepository;
exports.TrackRepository = TrackRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], TrackRepository);
//# sourceMappingURL=track.repository.js.map
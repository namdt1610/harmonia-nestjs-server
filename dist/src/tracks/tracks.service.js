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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const track_schema_1 = require("../schemas/track.schema");
const artist_schema_1 = require("../schemas/artist.schema");
const album_schema_1 = require("../schemas/album.schema");
const genre_schema_1 = require("../schemas/genre.schema");
let TracksService = class TracksService {
    trackModel;
    artistModel;
    albumModel;
    genreModel;
    constructor(trackModel, artistModel, albumModel, genreModel) {
        this.trackModel = trackModel;
        this.artistModel = artistModel;
        this.albumModel = albumModel;
        this.genreModel = genreModel;
    }
    async create(createTrackDto) {
        const artist = await this.artistModel.findById(createTrackDto.artistId);
        if (!artist) {
            throw new common_1.NotFoundException('Artist not found');
        }
        if (createTrackDto.albumId) {
            const album = await this.albumModel.findById(createTrackDto.albumId);
            if (!album) {
                throw new common_1.NotFoundException('Album not found');
            }
        }
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
        await this.artistModel.findByIdAndUpdate(createTrackDto.artistId, {
            $push: { tracks: savedTrack._id },
        });
        if (createTrackDto.albumId) {
            await this.albumModel.findByIdAndUpdate(createTrackDto.albumId, {
                $push: { tracks: savedTrack._id },
            });
        }
        return savedTrack.populate(['artist', 'album', 'genres']);
    }
    async findAll(queryParams = {}) {
        const { search, artistId, albumId, genreId, limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'desc', } = queryParams;
        const query = {};
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
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
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
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid track ID');
        }
        const track = await this.trackModel
            .findById(id)
            .populate('artist', 'name image bio')
            .populate('album', 'title image releaseDate')
            .populate('genres', 'name description')
            .exec();
        if (!track) {
            throw new common_1.NotFoundException('Track not found');
        }
        return track;
    }
    async update(id, updateTrackDto) {
        const track = await this.trackModel
            .findByIdAndUpdate(id, updateTrackDto, { new: true })
            .populate(['artist', 'album', 'genres'])
            .exec();
        if (!track) {
            throw new common_1.NotFoundException('Track not found');
        }
        return track;
    }
    async remove(id) {
        const track = await this.trackModel.findById(id);
        if (!track) {
            throw new common_1.NotFoundException('Track not found');
        }
        await this.artistModel.findByIdAndUpdate(track.artist, {
            $pull: { tracks: id },
        });
        if (track.album) {
            await this.albumModel.findByIdAndUpdate(track.album, {
                $pull: { tracks: id },
            });
        }
        await this.trackModel.findByIdAndDelete(id);
    }
    async incrementPlayCount(id) {
        const track = await this.trackModel
            .findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true })
            .populate(['artist', 'album', 'genres'])
            .exec();
        if (!track) {
            throw new common_1.NotFoundException('Track not found');
        }
        return track;
    }
    async incrementDownloadCount(id) {
        const track = await this.trackModel
            .findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true })
            .populate(['artist', 'album', 'genres'])
            .exec();
        if (!track) {
            throw new common_1.NotFoundException('Track not found');
        }
        return track;
    }
    async getPopularTracks(limit = 10) {
        return this.trackModel
            .find()
            .populate('artist', 'name image')
            .populate('album', 'title image')
            .sort({ playCount: -1 })
            .limit(limit)
            .exec();
    }
    async getRecentTracks(limit = 10) {
        return this.trackModel
            .find()
            .populate('artist', 'name image')
            .populate('album', 'title image')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getTracksByArtist(artistId, limit = 20) {
        return this.trackModel
            .find({ artist: artistId })
            .populate('album', 'title image')
            .populate('genres', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getTracksByAlbum(albumId) {
        return this.trackModel
            .find({ album: albumId })
            .populate('artist', 'name image')
            .populate('genres', 'name')
            .sort({ createdAt: 1 })
            .exec();
    }
    async searchTracks(query, limit = 20) {
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
exports.TracksService = TracksService;
exports.TracksService = TracksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __param(1, (0, mongoose_1.InjectModel)(artist_schema_1.Artist.name)),
    __param(2, (0, mongoose_1.InjectModel)(album_schema_1.Album.name)),
    __param(3, (0, mongoose_1.InjectModel)(genre_schema_1.Genre.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object])
], TracksService);
//# sourceMappingURL=tracks.service.js.map
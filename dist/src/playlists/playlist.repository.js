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
exports.PlaylistRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const playlist_schema_1 = require("../schemas/playlist.schema");
let PlaylistRepository = class PlaylistRepository {
    playlistModel;
    constructor(playlistModel) {
        this.playlistModel = playlistModel;
    }
    async create(createPlaylistDto) {
        const playlist = new this.playlistModel({
            ...createPlaylistDto,
            user: new mongoose_2.Types.ObjectId(createPlaylistDto.user),
        });
        return playlist.save();
    }
    async findAll(page = 1, limit = 10, search, isPublic, userId) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (isPublic !== undefined) {
            filter.isPublic = isPublic;
        }
        if (userId) {
            filter.user = new mongoose_2.Types.ObjectId(userId);
        }
        const [playlists, total] = await Promise.all([
            this.playlistModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate('user', 'username image firstName lastName')
                .populate({
                path: 'tracks',
                select: 'title duration image playCount',
                populate: {
                    path: 'artist',
                    select: 'name image',
                },
            })
                .sort({ createdAt: -1 })
                .exec(),
            this.playlistModel.countDocuments(filter),
        ]);
        return { playlists, total };
    }
    async findById(id) {
        return this.playlistModel
            .findById(id)
            .populate('user', 'username image firstName lastName bio')
            .populate({
            path: 'tracks',
            select: 'title duration image playCount lyrics file',
            populate: {
                path: 'artist',
                select: 'name image bio',
            },
        })
            .exec();
    }
    async findByUser(userId) {
        return this.playlistModel
            .find({ user: new mongoose_2.Types.ObjectId(userId) })
            .populate({
            path: 'tracks',
            select: 'title duration image',
            populate: {
                path: 'artist',
                select: 'name image',
            },
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async addTrack(playlistId, trackId) {
        return this.playlistModel
            .findByIdAndUpdate(playlistId, { $addToSet: { tracks: new mongoose_2.Types.ObjectId(trackId) } }, { new: true })
            .exec();
    }
    async removeTrack(playlistId, trackId) {
        return this.playlistModel
            .findByIdAndUpdate(playlistId, { $pull: { tracks: new mongoose_2.Types.ObjectId(trackId) } }, { new: true })
            .exec();
    }
    async update(id, updatePlaylistDto) {
        return this.playlistModel
            .findByIdAndUpdate(id, updatePlaylistDto, { new: true })
            .exec();
    }
    async delete(id) {
        return this.playlistModel.findByIdAndDelete(id).exec();
    }
    async search(query, limit = 20) {
        return this.playlistModel
            .find({
            isPublic: true,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ],
        })
            .populate('user', 'username image')
            .limit(limit)
            .exec();
    }
};
exports.PlaylistRepository = PlaylistRepository;
exports.PlaylistRepository = PlaylistRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(playlist_schema_1.Playlist.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], PlaylistRepository);
//# sourceMappingURL=playlist.repository.js.map
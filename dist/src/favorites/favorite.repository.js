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
exports.FavoriteRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const favorite_schema_1 = require("../schemas/favorite.schema");
let FavoriteRepository = class FavoriteRepository {
    favoriteModel;
    constructor(favoriteModel) {
        this.favoriteModel = favoriteModel;
    }
    async create(createFavoriteDto) {
        const favorite = new this.favoriteModel(createFavoriteDto);
        return await favorite.save();
    }
    async findAll(page = 1, limit = 10, filters = {}) {
        const query = {};
        if (filters.userId) {
            query.user = new mongoose_2.Types.ObjectId(filters.userId);
        }
        if (filters.type) {
            query.type = filters.type;
        }
        const skip = (page - 1) * limit;
        const [favorites, total] = await Promise.all([
            this.favoriteModel
                .find(query)
                .sort({ addedAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'username email')
                .exec(),
            this.favoriteModel.countDocuments(query),
        ]);
        return {
            favorites,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.favoriteModel
            .findById(id)
            .populate('user', 'username email')
            .exec();
    }
    async findByUser(userId, type, page = 1, limit = 10) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            return {
                favorites: [],
                total: 0,
                page,
                totalPages: 0,
            };
        }
        const query = { user: new mongoose_2.Types.ObjectId(userId) };
        if (type) {
            query.type = type;
        }
        const skip = (page - 1) * limit;
        const [favorites, total] = await Promise.all([
            this.favoriteModel
                .find(query)
                .sort({ addedAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'username email')
                .exec(),
            this.favoriteModel.countDocuments(query),
        ]);
        return {
            favorites,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findUserFavoritesByType(userId, type) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            return [];
        }
        return await this.favoriteModel
            .find({
            user: new mongoose_2.Types.ObjectId(userId),
            type,
        })
            .sort({ addedAt: -1 })
            .populate('user', 'username email')
            .exec();
    }
    async findUserFavoriteTracks(userId) {
        return await this.findUserFavoritesByType(userId, favorite_schema_1.FavoriteType.TRACK);
    }
    async findUserFavoriteArtists(userId) {
        return await this.findUserFavoritesByType(userId, favorite_schema_1.FavoriteType.ARTIST);
    }
    async findUserFavoriteAlbums(userId) {
        return await this.findUserFavoritesByType(userId, favorite_schema_1.FavoriteType.ALBUM);
    }
    async findUserFavoritePlaylists(userId) {
        return await this.findUserFavoritesByType(userId, favorite_schema_1.FavoriteType.PLAYLIST);
    }
    async isItemFavorited(userId, itemId, type) {
        if (!mongoose_2.Types.ObjectId.isValid(userId) || !mongoose_2.Types.ObjectId.isValid(itemId)) {
            return false;
        }
        const favorite = await this.favoriteModel
            .findOne({
            user: new mongoose_2.Types.ObjectId(userId),
            itemId: new mongoose_2.Types.ObjectId(itemId),
            type,
        })
            .exec();
        return !!favorite;
    }
    async addToFavorites(userId, itemId, type) {
        if (!mongoose_2.Types.ObjectId.isValid(userId) || !mongoose_2.Types.ObjectId.isValid(itemId)) {
            return null;
        }
        const existingFavorite = await this.favoriteModel
            .findOne({
            user: new mongoose_2.Types.ObjectId(userId),
            itemId: new mongoose_2.Types.ObjectId(itemId),
            type,
        })
            .exec();
        if (existingFavorite) {
            return existingFavorite;
        }
        const createFavoriteDto = {
            user: new mongoose_2.Types.ObjectId(userId),
            itemId: new mongoose_2.Types.ObjectId(itemId),
            type,
        };
        return await this.create(createFavoriteDto);
    }
    async removeFromFavorites(userId, itemId, type) {
        if (!mongoose_2.Types.ObjectId.isValid(userId) || !mongoose_2.Types.ObjectId.isValid(itemId)) {
            return false;
        }
        const result = await this.favoriteModel
            .findOneAndDelete({
            user: new mongoose_2.Types.ObjectId(userId),
            itemId: new mongoose_2.Types.ObjectId(itemId),
            type,
        })
            .exec();
        return !!result;
    }
    async delete(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return false;
        }
        const result = await this.favoriteModel.findByIdAndDelete(id).exec();
        return !!result;
    }
    async getUserFavoriteCount(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            return 0;
        }
        return await this.favoriteModel
            .countDocuments({ user: new mongoose_2.Types.ObjectId(userId) })
            .exec();
    }
    async getUserFavoriteCountsByType(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            return {
                tracks: 0,
                artists: 0,
                albums: 0,
                playlists: 0,
                total: 0,
            };
        }
        const counts = await this.favoriteModel.aggregate([
            { $match: { user: new mongoose_2.Types.ObjectId(userId) } },
            { $group: { _id: '$type', count: { $sum: 1 } } },
        ]);
        const result = {
            tracks: 0,
            artists: 0,
            albums: 0,
            playlists: 0,
            total: 0,
        };
        counts.forEach((item) => {
            const count = item.count;
            switch (item._id) {
                case favorite_schema_1.FavoriteType.TRACK:
                    result.tracks = count;
                    break;
                case favorite_schema_1.FavoriteType.ARTIST:
                    result.artists = count;
                    break;
                case favorite_schema_1.FavoriteType.ALBUM:
                    result.albums = count;
                    break;
                case favorite_schema_1.FavoriteType.PLAYLIST:
                    result.playlists = count;
                    break;
            }
            result.total += count;
        });
        return result;
    }
    async getMostFavoritedItems(type, limit = 10) {
        return await this.favoriteModel.aggregate([
            { $match: { type } },
            { $group: { _id: '$itemId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
            {
                $project: {
                    itemId: { $toString: '$_id' },
                    count: 1,
                    _id: 0,
                },
            },
        ]);
    }
    async getStatistics() {
        const [stats, favoritesByType, uniqueUsersResult] = await Promise.all([
            this.favoriteModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalFavorites: { $sum: 1 },
                    },
                },
            ]),
            this.favoriteModel.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } },
            ]),
            this.favoriteModel.aggregate([
                { $group: { _id: '$user' } },
                { $group: { _id: null, uniqueUsers: { $sum: 1 } } },
            ]),
        ]);
        const favoritesByTypeObj = Object.values(favorite_schema_1.FavoriteType).reduce((acc, type) => {
            acc[type] = 0;
            return acc;
        }, {});
        favoritesByType.forEach((item) => {
            favoritesByTypeObj[item._id] = item.count;
        });
        const totalFavorites = stats[0]?.totalFavorites || 0;
        const uniqueUsers = uniqueUsersResult[0]?.uniqueUsers || 0;
        return {
            totalFavorites,
            favoritesByType: favoritesByTypeObj,
            uniqueUsers,
            averageFavoritesPerUser: uniqueUsers > 0 ? totalFavorites / uniqueUsers : 0,
        };
    }
    async clearUserFavorites(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            return false;
        }
        await this.favoriteModel
            .deleteMany({ user: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        return true;
    }
};
exports.FavoriteRepository = FavoriteRepository;
exports.FavoriteRepository = FavoriteRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(favorite_schema_1.Favorite.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], FavoriteRepository);
//# sourceMappingURL=favorite.repository.js.map
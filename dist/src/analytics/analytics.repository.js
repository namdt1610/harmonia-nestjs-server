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
exports.AnalyticsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_activity_schema_1 = require("../schemas/user-activity.schema");
let AnalyticsRepository = class AnalyticsRepository {
    userActivityModel;
    constructor(userActivityModel) {
        this.userActivityModel = userActivityModel;
    }
    async create(createUserActivityDto) {
        const userActivity = new this.userActivityModel(createUserActivityDto);
        return await userActivity.save();
    }
    async findAll(page = 1, limit = 10, filters = {}) {
        const query = {};
        if (filters.userId) {
            query.user = new mongoose_2.Types.ObjectId(filters.userId);
        }
        if (filters.activityType) {
            query.activityType = filters.activityType;
        }
        if (filters.trackId) {
            query.track = new mongoose_2.Types.ObjectId(filters.trackId);
        }
        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate) {
                query.createdAt.$gte = filters.startDate;
            }
            if (filters.endDate) {
                query.createdAt.$lte = filters.endDate;
            }
        }
        const skip = (page - 1) * limit;
        const [activities, total] = await Promise.all([
            this.userActivityModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'username email')
                .populate('track', 'title duration')
                .exec(),
            this.userActivityModel.countDocuments(query),
        ]);
        return {
            activities,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.userActivityModel
            .findById(id)
            .populate('user', 'username email')
            .populate('track', 'title duration')
            .exec();
    }
    async findByUser(userId, activityType, page = 1, limit = 10) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            return {
                activities: [],
                total: 0,
                page,
                totalPages: 0,
            };
        }
        const query = { user: new mongoose_2.Types.ObjectId(userId) };
        if (activityType) {
            query.activityType = activityType;
        }
        const skip = (page - 1) * limit;
        const [activities, total] = await Promise.all([
            this.userActivityModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'username email')
                .populate('track', 'title duration artist album')
                .exec(),
            this.userActivityModel.countDocuments(query),
        ]);
        return {
            activities,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async trackActivity(userId, activityType, trackId, metadata, ipAddress, userAgent) {
        const createActivityDto = {
            user: new mongoose_2.Types.ObjectId(userId),
            activityType,
            metadata,
            ipAddress,
            userAgent,
        };
        if (trackId && mongoose_2.Types.ObjectId.isValid(trackId)) {
            createActivityDto.track = new mongoose_2.Types.ObjectId(trackId);
        }
        return await this.create(createActivityDto);
    }
    async getGlobalStatistics(startDate, endDate) {
        const dateFilter = {};
        if (startDate || endDate) {
            if (startDate)
                dateFilter.$gte = startDate;
            if (endDate)
                dateFilter.$lte = endDate;
        }
        const matchStage = Object.keys(dateFilter).length > 0
            ? { $match: { createdAt: dateFilter } }
            : { $match: {} };
        const [basicStats] = await this.userActivityModel.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    totalActivities: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$user' },
                },
            },
            {
                $project: {
                    totalActivities: 1,
                    uniqueUsers: { $size: '$uniqueUsers' },
                },
            },
        ]);
        const activitiesByTypeRaw = await this.userActivityModel.aggregate([
            matchStage,
            { $group: { _id: '$activityType', count: { $sum: 1 } } },
        ]);
        const activitiesByType = Object.values(user_activity_schema_1.ActivityType).reduce((acc, type) => {
            acc[type] = 0;
            return acc;
        }, {});
        activitiesByTypeRaw.forEach((item) => {
            activitiesByType[item._id] = item.count;
        });
        const mostActiveUsers = await this.userActivityModel.aggregate([
            matchStage,
            { $group: { _id: '$user', activityCount: { $sum: 1 } } },
            { $sort: { activityCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    userId: { $toString: '$_id' },
                    username: '$userInfo.username',
                    activityCount: 1,
                    _id: 0,
                },
            },
        ]);
        const mostPlayedTracks = await this.userActivityModel.aggregate([
            {
                ...matchStage,
                $match: {
                    ...matchStage.$match,
                    activityType: user_activity_schema_1.ActivityType.PLAY,
                    track: { $exists: true },
                },
            },
            { $group: { _id: '$track', playCount: { $sum: 1 } } },
            { $sort: { playCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'tracks',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'trackInfo',
                },
            },
            { $unwind: '$trackInfo' },
            {
                $project: {
                    trackId: { $toString: '$_id' },
                    title: '$trackInfo.title',
                    playCount: 1,
                    _id: 0,
                },
            },
        ]);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activityTimeline = await this.userActivityModel.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        const peakHours = await this.userActivityModel.aggregate([
            matchStage,
            {
                $group: {
                    _id: { $hour: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            {
                $project: {
                    hour: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        return {
            totalActivities: basicStats?.totalActivities || 0,
            uniqueUsers: basicStats?.uniqueUsers || 0,
            activitiesByType,
            mostActiveUsers,
            mostPlayedTracks,
            activityTimeline,
            peakHours,
        };
    }
    async getUserAnalytics(userId, startDate, endDate) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            return {
                totalActivities: 0,
                activitiesByType: {},
                mostPlayedTracks: [],
                activityTimeline: [],
                listeningPatterns: [],
                firstActivityDate: null,
                lastActivityDate: null,
            };
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const dateFilter = { user: userObjectId };
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate)
                dateFilter.createdAt.$gte = startDate;
            if (endDate)
                dateFilter.createdAt.$lte = endDate;
        }
        const [basicStats] = await this.userActivityModel.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalActivities: { $sum: 1 },
                    firstActivity: { $min: '$createdAt' },
                    lastActivity: { $max: '$createdAt' },
                },
            },
        ]);
        const activitiesByTypeRaw = await this.userActivityModel.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$activityType', count: { $sum: 1 } } },
        ]);
        const activitiesByType = Object.values(user_activity_schema_1.ActivityType).reduce((acc, type) => {
            acc[type] = 0;
            return acc;
        }, {});
        activitiesByTypeRaw.forEach((item) => {
            activitiesByType[item._id] = item.count;
        });
        const mostPlayedTracks = await this.userActivityModel.aggregate([
            {
                $match: {
                    ...dateFilter,
                    activityType: user_activity_schema_1.ActivityType.PLAY,
                    track: { $exists: true },
                },
            },
            { $group: { _id: '$track', playCount: { $sum: 1 } } },
            { $sort: { playCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'tracks',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'trackInfo',
                },
            },
            { $unwind: '$trackInfo' },
            {
                $project: {
                    trackId: { $toString: '$_id' },
                    title: '$trackInfo.title',
                    playCount: 1,
                    _id: 0,
                },
            },
        ]);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activityTimeline = await this.userActivityModel.aggregate([
            { $match: { user: userObjectId, createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        const listeningPatterns = await this.userActivityModel.aggregate([
            { $match: { ...dateFilter, activityType: user_activity_schema_1.ActivityType.PLAY } },
            {
                $group: {
                    _id: { $hour: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    hour: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        return {
            totalActivities: basicStats?.totalActivities || 0,
            activitiesByType,
            mostPlayedTracks,
            activityTimeline,
            listeningPatterns,
            firstActivityDate: basicStats?.firstActivity || null,
            lastActivityDate: basicStats?.lastActivity || null,
        };
    }
    async getTopTracks(limit = 10, startDate, endDate) {
        const dateFilter = {
            activityType: user_activity_schema_1.ActivityType.PLAY,
            track: { $exists: true },
        };
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate)
                dateFilter.createdAt.$gte = startDate;
            if (endDate)
                dateFilter.createdAt.$lte = endDate;
        }
        return await this.userActivityModel.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$track', playCount: { $sum: 1 } } },
            { $sort: { playCount: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'tracks',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'trackInfo',
                },
            },
            { $unwind: '$trackInfo' },
            {
                $project: {
                    trackId: { $toString: '$_id' },
                    title: '$trackInfo.title',
                    playCount: 1,
                    _id: 0,
                },
            },
        ]);
    }
    async delete(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return false;
        }
        const result = await this.userActivityModel.findByIdAndDelete(id);
        return !!result;
    }
    async deleteUserActivities(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            return false;
        }
        await this.userActivityModel.deleteMany({
            user: new mongoose_2.Types.ObjectId(userId),
        });
        return true;
    }
};
exports.AnalyticsRepository = AnalyticsRepository;
exports.AnalyticsRepository = AnalyticsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_activity_schema_1.UserActivity.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AnalyticsRepository);
//# sourceMappingURL=analytics.repository.js.map
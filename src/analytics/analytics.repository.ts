import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserActivity, Prisma } from '@prisma/client';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';

// Define enums that match the original schema
export enum ActivityType {
  PLAY = 'PLAY',
  DOWNLOAD = 'DOWNLOAD',
  LIKE = 'LIKE',
  SHARE = 'SHARE',
  SEARCH = 'SEARCH',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PLAYLIST_CREATE = 'PLAYLIST_CREATE',
  PLAYLIST_ADD = 'PLAYLIST_ADD',
  PLAYLIST_REMOVE = 'PLAYLIST_REMOVE',
}

type UserActivityWithUser = UserActivity & {
  user: {
    id: string;
    username: string;
    email: string;
  };
};

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserActivityDto: CreateUserActivityDto,
  ): Promise<UserActivity> {
    return this.prisma.userActivity.create({
      data: {
        action: createUserActivityDto.activityType,
        metadata: createUserActivityDto.metadata,
        ipAddress: createUserActivityDto.ipAddress,
        userAgent: createUserActivityDto.userAgent,
        userId: createUserActivityDto.user,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: {
      userId?: string;
      activityType?: ActivityType;
      startDate?: Date;
      endDate?: Date;
      trackId?: string;
    } = {},
  ): Promise<{
    activities: UserActivityWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: Prisma.UserActivityWhereInput = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.activityType) {
      where.action = filters.activityType;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    // Note: trackId filtering would need to be handled through metadata for now
    // since UserActivity doesn't have a direct track relation in the current schema
    if (filters.trackId && filters.trackId.trim()) {
      where.metadata = {
        path: ['trackId'],
        equals: filters.trackId,
      };
    }

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      this.prisma.userActivity.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userActivity.count({ where }),
    ]);

    return {
      activities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<UserActivityWithUser | null> {
    return this.prisma.userActivity.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUser(
    userId: string,
    activityType?: ActivityType,
    page = 1,
    limit = 10,
  ): Promise<{
    activities: UserActivityWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: Prisma.UserActivityWhereInput = { userId };

    if (activityType) {
      where.action = activityType;
    }

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      this.prisma.userActivity.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userActivity.count({ where }),
    ]);

    return {
      activities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async trackActivity(
    userId: string,
    activityType: ActivityType,
    trackId?: string,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserActivity> {
    const activityMetadata = metadata || {};

    // Include trackId in metadata if provided
    if (trackId) {
      activityMetadata.trackId = trackId;
    }

    return this.create({
      user: userId,
      activityType,
      metadata: activityMetadata,
      ipAddress,
      userAgent,
    });
  }

  async getGlobalStatistics(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalActivities: number;
    uniqueUsers: number;
    activitiesByType: Record<ActivityType, number>;
    mostActiveUsers: Array<{
      userId: string;
      username: string;
      activityCount: number;
    }>;
    mostPlayedTracks: Array<{
      trackId: string;
      title: string;
      playCount: number;
    }>;
    activityTimeline: Array<{
      date: string;
      count: number;
    }>;
    peakHours: Array<{
      hour: number;
      count: number;
    }>;
  }> {
    const where: Prisma.UserActivityWhereInput = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Get total activities and unique users
    const [totalActivities, uniqueUsersCount] = await Promise.all([
      this.prisma.userActivity.count({ where }),
      this.prisma.userActivity
        .findMany({
          where,
          select: { userId: true },
          distinct: ['userId'],
        })
        .then((users) => users.length),
    ]);

    // Get activities by type using raw query for better performance
    const activitiesByTypeRaw = await this.prisma.$queryRaw<
      Array<{ action: string; count: bigint }>
    >`
      SELECT action, COUNT(*) as count
      FROM user_activities
      ${startDate || endDate ? 'WHERE' : ''}
      ${startDate ? `created_at >= ${startDate.toISOString()}` : ''}
      ${startDate && endDate ? ' AND ' : ''}
      ${endDate ? `created_at <= ${endDate.toISOString()}` : ''}
      GROUP BY action
    `;

    const activitiesByType = activitiesByTypeRaw.reduce(
      (acc, item) => {
        acc[item.action as ActivityType] = Number(item.count);
        return acc;
      },
      {} as Record<ActivityType, number>,
    );

    // Get most active users
    const mostActiveUsersRaw = await this.prisma.$queryRaw<
      Array<{ userId: string; username: string; activityCount: bigint }>
    >`
      SELECT ua.user_id as "userId", u.username, COUNT(*) as "activityCount"
      FROM user_activities ua
      JOIN users u ON ua.user_id = u.id
      ${startDate || endDate ? 'WHERE' : ''}
      ${startDate ? `ua.created_at >= ${startDate.toISOString()}` : ''}
      ${startDate && endDate ? ' AND ' : ''}
      ${endDate ? `ua.created_at <= ${endDate.toISOString()}` : ''}
      GROUP BY ua.user_id, u.username
      ORDER BY "activityCount" DESC
      LIMIT 10
    `;

    const mostActiveUsers = mostActiveUsersRaw.map((user) => ({
      userId: user.userId,
      username: user.username,
      activityCount: Number(user.activityCount),
    }));

    // Get most played tracks (from metadata)
    const playActivities = await this.prisma.userActivity.findMany({
      where: {
        ...where,
        action: ActivityType.PLAY,
        metadata: {
          path: ['trackId'],
          not: Prisma.AnyNull,
        },
      },
      select: {
        metadata: true,
      },
    });

    const trackPlayCounts = playActivities.reduce(
      (acc, activity) => {
        const trackId = (activity.metadata as any)?.trackId;
        if (trackId) {
          acc[trackId] = (acc[trackId] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get track details for most played tracks
    const topTrackIds = Object.entries(trackPlayCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([trackId]) => trackId);

    const trackDetails = await this.prisma.track.findMany({
      where: { id: { in: topTrackIds } },
      select: { id: true, title: true },
    });

    const mostPlayedTracks = trackDetails.map((track) => ({
      trackId: track.id,
      title: track.title,
      playCount: trackPlayCounts[track.id] || 0,
    }));

    // Get activity timeline (last 30 days)
    const timelineStartDate =
      startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const timelineActivities = await this.prisma.$queryRaw<
      Array<{ date: string; count: bigint }>
    >`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM user_activities
      WHERE created_at >= ${timelineStartDate.toISOString()}
      ${endDate ? `AND created_at <= ${endDate.toISOString()}` : ''}
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    const activityTimeline = timelineActivities.map((item) => ({
      date: item.date,
      count: Number(item.count),
    }));

    // Get peak hours
    const peakHoursRaw = await this.prisma.$queryRaw<
      Array<{ hour: number; count: bigint }>
    >`
      SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as count
      FROM user_activities
      ${startDate || endDate ? 'WHERE' : ''}
      ${startDate ? `created_at >= ${startDate.toISOString()}` : ''}
      ${startDate && endDate ? ' AND ' : ''}
      ${endDate ? `created_at <= ${endDate.toISOString()}` : ''}
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `;

    const peakHours = peakHoursRaw.map((item) => ({
      hour: Number(item.hour),
      count: Number(item.count),
    }));

    return {
      totalActivities,
      uniqueUsers: uniqueUsersCount,
      activitiesByType,
      mostActiveUsers,
      mostPlayedTracks,
      activityTimeline,
      peakHours,
    };
  }

  async getUserAnalytics(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalActivities: number;
    activitiesByType: Record<ActivityType, number>;
    mostPlayedTracks: Array<{
      trackId: string;
      title: string;
      playCount: number;
    }>;
    activityTimeline: Array<{
      date: string;
      count: number;
    }>;
    listeningPatterns: Array<{
      hour: number;
      count: number;
    }>;
    firstActivityDate: Date | null;
    lastActivityDate: Date | null;
  }> {
    const where: Prisma.UserActivityWhereInput = { userId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Get total activities
    const totalActivities = await this.prisma.userActivity.count({ where });

    // Get activities by type
    const activitiesByTypeRaw = await this.prisma.$queryRaw<
      Array<{ action: string; count: bigint }>
    >`
      SELECT action, COUNT(*) as count
      FROM user_activities
      WHERE user_id = ${userId}
      ${startDate ? `AND created_at >= ${startDate.toISOString()}` : ''}
      ${endDate ? `AND created_at <= ${endDate.toISOString()}` : ''}
      GROUP BY action
    `;

    const activitiesByType = activitiesByTypeRaw.reduce(
      (acc, item) => {
        acc[item.action as ActivityType] = Number(item.count);
        return acc;
      },
      {} as Record<ActivityType, number>,
    );

    // Get most played tracks for this user
    const playActivities = await this.prisma.userActivity.findMany({
      where: {
        ...where,
        action: ActivityType.PLAY,
        metadata: {
          path: ['trackId'],
          not: Prisma.AnyNull,
        },
      },
      select: {
        metadata: true,
      },
    });

    const trackPlayCounts = playActivities.reduce(
      (acc, activity) => {
        const trackId = (activity.metadata as any)?.trackId;
        if (trackId) {
          acc[trackId] = (acc[trackId] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const topTrackIds = Object.entries(trackPlayCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([trackId]) => trackId);

    const trackDetails = await this.prisma.track.findMany({
      where: { id: { in: topTrackIds } },
      select: { id: true, title: true },
    });

    const mostPlayedTracks = trackDetails.map((track) => ({
      trackId: track.id,
      title: track.title,
      playCount: trackPlayCounts[track.id] || 0,
    }));

    // Get activity timeline
    const timelineActivities = await this.prisma.$queryRaw<
      Array<{ date: string; count: bigint }>
    >`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM user_activities
      WHERE user_id = ${userId}
      ${startDate ? `AND created_at >= ${startDate.toISOString()}` : ''}
      ${endDate ? `AND created_at <= ${endDate.toISOString()}` : ''}
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    const activityTimeline = timelineActivities.map((item) => ({
      date: item.date,
      count: Number(item.count),
    }));

    // Get listening patterns (hourly)
    const listeningPatternsRaw = await this.prisma.$queryRaw<
      Array<{ hour: number; count: bigint }>
    >`
      SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as count
      FROM user_activities
      WHERE user_id = ${userId}
      ${startDate ? `AND created_at >= ${startDate.toISOString()}` : ''}
      ${endDate ? `AND created_at <= ${endDate.toISOString()}` : ''}
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `;

    const listeningPatterns = listeningPatternsRaw.map((item) => ({
      hour: Number(item.hour),
      count: Number(item.count),
    }));

    // Get first and last activity dates
    const [firstActivity, lastActivity] = await Promise.all([
      this.prisma.userActivity.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
      this.prisma.userActivity.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      totalActivities,
      activitiesByType,
      mostPlayedTracks,
      activityTimeline,
      listeningPatterns,
      firstActivityDate: firstActivity?.createdAt || null,
      lastActivityDate: lastActivity?.createdAt || null,
    };
  }

  async getTopTracks(
    limit = 10,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Array<{ trackId: string; title: string; playCount: number }>> {
    const where: Prisma.UserActivityWhereInput = {
      action: ActivityType.PLAY,
      metadata: {
        path: ['trackId'],
        not: Prisma.AnyNull,
      },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const playActivities = await this.prisma.userActivity.findMany({
      where,
      select: {
        metadata: true,
      },
    });

    const trackPlayCounts = playActivities.reduce(
      (acc, activity) => {
        const trackId = (activity.metadata as any)?.trackId;
        if (trackId) {
          acc[trackId] = (acc[trackId] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const topTrackIds = Object.entries(trackPlayCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([trackId]) => trackId);

    const trackDetails = await this.prisma.track.findMany({
      where: { id: { in: topTrackIds } },
      select: { id: true, title: true },
    });

    return trackDetails.map((track) => ({
      trackId: track.id,
      title: track.title,
      playCount: trackPlayCounts[track.id] || 0,
    }));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userActivity.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async deleteUserActivities(userId: string): Promise<boolean> {
    try {
      await this.prisma.userActivity.deleteMany({ where: { userId } });
      return true;
    } catch (error) {
      throw error;
    }
  }
}

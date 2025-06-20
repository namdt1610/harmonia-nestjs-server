import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { ActivityType } from '../../schemas/user-activity.schema';

class UserInfo {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

class TrackInfo {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  artist: any;

  @Expose()
  album: any;
}

export class UserActivityResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the activity',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({
    description: 'The type of activity',
    enum: ActivityType,
    example: ActivityType.PLAY,
  })
  @Expose()
  activityType: ActivityType;

  @ApiProperty({
    description: 'Additional metadata about the activity',
    example: { playedFor: 30, volume: 0.8 },
  })
  @Expose()
  metadata: any;

  @ApiProperty({
    description: 'IP address of the user',
    example: '192.168.1.1',
  })
  @Expose()
  ipAddress: string;

  @ApiProperty({
    description: 'User agent string',
    example: 'Mozilla/5.0...',
  })
  @Expose()
  userAgent: string;

  @ApiProperty({
    description: 'The user who performed the activity',
    type: UserInfo,
  })
  @Expose()
  @Type(() => UserInfo)
  user: UserInfo;

  @ApiProperty({
    description: 'The track related to the activity',
    type: TrackInfo,
    required: false,
  })
  @Expose()
  @Type(() => TrackInfo)
  track?: TrackInfo;

  @ApiProperty({
    description: 'When the activity was performed',
    example: '2023-12-01T12:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}

export class AnalyticsStatsResponseDto {
  @ApiProperty({
    description: 'Total number of activities tracked',
    example: 1000,
  })
  @Expose()
  totalActivities: number;

  @ApiProperty({
    description: 'Number of unique users with activities',
    example: 100,
  })
  @Expose()
  uniqueUsers: number;

  @ApiProperty({
    description: 'Activity breakdown by type',
    example: {
      PLAY: 500,
      DOWNLOAD: 200,
      LIKE: 150,
      SKIP: 100,
      SHARE: 50,
    },
  })
  @Expose()
  activitiesByType: Record<ActivityType, number>;

  @ApiProperty({
    description: 'Most active users',
    example: [
      {
        userId: '507f1f77bcf86cd799439011',
        username: 'user1',
        activityCount: 50,
      },
      {
        userId: '507f1f77bcf86cd799439012',
        username: 'user2',
        activityCount: 45,
      },
    ],
  })
  @Expose()
  mostActiveUsers: Array<{
    userId: string;
    username: string;
    activityCount: number;
  }>;

  @ApiProperty({
    description: 'Most played tracks',
    example: [
      { trackId: '507f1f77bcf86cd799439011', title: 'Song 1', playCount: 100 },
      { trackId: '507f1f77bcf86cd799439012', title: 'Song 2', playCount: 85 },
    ],
  })
  @Expose()
  mostPlayedTracks: Array<{
    trackId: string;
    title: string;
    playCount: number;
  }>;

  @ApiProperty({
    description: 'Activity timeline (last 30 days)',
    example: [
      { date: '2023-12-01', count: 50 },
      { date: '2023-12-02', count: 45 },
    ],
  })
  @Expose()
  activityTimeline: Array<{
    date: string;
    count: number;
  }>;

  @ApiProperty({
    description: 'Peak activity hours (0-23)',
    example: [
      { hour: 14, count: 120 },
      { hour: 20, count: 115 },
    ],
  })
  @Expose()
  peakHours: Array<{
    hour: number;
    count: number;
  }>;
}

export class UserAnalyticsResponseDto {
  @ApiProperty({
    description: 'User information',
    type: UserInfo,
  })
  @Expose()
  @Type(() => UserInfo)
  user: UserInfo;

  @ApiProperty({
    description: 'Total activities by this user',
    example: 150,
  })
  @Expose()
  totalActivities: number;

  @ApiProperty({
    description: 'User activity breakdown by type',
    example: {
      PLAY: 100,
      DOWNLOAD: 20,
      LIKE: 15,
      SKIP: 10,
      SHARE: 5,
    },
  })
  @Expose()
  activitiesByType: Record<ActivityType, number>;

  @ApiProperty({
    description: "User's most played tracks",
    example: [
      { trackId: '507f1f77bcf86cd799439011', title: 'Song 1', playCount: 25 },
      { trackId: '507f1f77bcf86cd799439012', title: 'Song 2', playCount: 20 },
    ],
  })
  @Expose()
  mostPlayedTracks: Array<{
    trackId: string;
    title: string;
    playCount: number;
  }>;

  @ApiProperty({
    description: 'User activity timeline (last 30 days)',
    example: [
      { date: '2023-12-01', count: 5 },
      { date: '2023-12-02', count: 8 },
    ],
  })
  @Expose()
  activityTimeline: Array<{
    date: string;
    count: number;
  }>;

  @ApiProperty({
    description: "User's listening patterns by hour",
    example: [
      { hour: 14, count: 12 },
      { hour: 20, count: 15 },
    ],
  })
  @Expose()
  listeningPatterns: Array<{
    hour: number;
    count: number;
  }>;

  @ApiProperty({
    description: 'First activity date',
    example: '2023-11-01T10:00:00.000Z',
  })
  @Expose()
  firstActivityDate: Date;

  @ApiProperty({
    description: 'Last activity date',
    example: '2023-12-01T15:30:00.000Z',
  })
  @Expose()
  lastActivityDate: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

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
  duration: number;

  @Expose()
  audioFileUrl: string;

  @Expose()
  artist: any;

  @Expose()
  album: any;
}

export class StreamQueueResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the stream queue',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({
    description: 'The user who owns this stream queue',
    type: UserInfo,
  })
  @Expose()
  @Type(() => UserInfo)
  user: UserInfo;

  @ApiProperty({
    description: 'Array of tracks in the queue',
    type: [TrackInfo],
  })
  @Expose()
  @Type(() => TrackInfo)
  tracks: TrackInfo[];

  @ApiProperty({
    description: 'Current index of the playing track',
    example: 0,
  })
  @Expose()
  currentIndex: number;

  @ApiProperty({
    description: 'Whether shuffle is enabled',
    example: false,
  })
  @Expose()
  shuffle: boolean;

  @ApiProperty({
    description: 'Repeat mode',
    example: 'off',
    enum: ['off', 'track', 'playlist'],
  })
  @Expose()
  repeat: string;

  @ApiProperty({
    description: 'When the queue was last played',
    example: '2023-12-01T12:00:00.000Z',
  })
  @Expose()
  lastPlayed: Date;

  @ApiProperty({
    description: 'When the queue was created',
    example: '2023-12-01T12:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'When the queue was last updated',
    example: '2023-12-01T12:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'The currently playing track (computed)',
    type: TrackInfo,
    required: false,
  })
  @Expose()
  @Type(() => TrackInfo)
  currentTrack?: TrackInfo;

  @ApiProperty({
    description: 'The next track in the queue (computed)',
    type: TrackInfo,
    required: false,
  })
  @Expose()
  @Type(() => TrackInfo)
  nextTrack?: TrackInfo;

  @ApiProperty({
    description: 'Total number of tracks in the queue',
    example: 10,
  })
  @Expose()
  @Transform(({ obj }) => obj.tracks?.length || 0)
  totalTracks: number;

  @ApiProperty({
    description: 'Total duration of all tracks in the queue (in seconds)',
    example: 2400,
  })
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.tracks || !Array.isArray(obj.tracks)) return 0;
    return obj.tracks.reduce(
      (total: number, track: any) => total + (track.duration || 0),
      0,
    );
  })
  totalDuration: number;
}

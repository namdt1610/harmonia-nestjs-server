import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ActivityType } from '../analytics.repository';

export class CreateUserActivityDto {
  @ApiProperty({
    description: 'The type of activity being tracked',
    enum: ActivityType,
    example: ActivityType.PLAY,
  })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiProperty({
    description: 'Additional metadata about the activity',
    example: { playedFor: 30, volume: 0.8 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiProperty({
    description: 'IP address of the user',
    example: '192.168.1.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent string',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    description: 'The ID of the user performing the activity',
    example: 'cluxy1234567890abcdefgh',
  })
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiProperty({
    description: 'The ID of the track related to the activity (if applicable)',
    example: 'cluxy1234567890abcdefgi',
    required: false,
  })
  @IsOptional()
  @IsString()
  track?: string;
}

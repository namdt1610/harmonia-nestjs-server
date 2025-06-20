import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

class UserBasicInfo {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  image?: string;
}

class TrackBasicInfo {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  image?: string;

  artist?: {
    id: string;
    name: string;
    image?: string;
  };
}

export class PlaylistResponseDto {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  followers: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty({ type: UserBasicInfo })
  @Type(() => UserBasicInfo)
  user: UserBasicInfo;

  @ApiPropertyOptional({ type: [TrackBasicInfo] })
  @Type(() => TrackBasicInfo)
  tracks?: TrackBasicInfo[];

  @ApiPropertyOptional()
  trackCount?: number;

  @ApiPropertyOptional()
  totalDuration?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

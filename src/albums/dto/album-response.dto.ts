import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

class ArtistBasicInfo {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  name: string;

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
  playCount?: number;
}

export class AlbumResponseDto {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  releaseDate?: Date;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: ArtistBasicInfo })
  @Type(() => ArtistBasicInfo)
  artist: ArtistBasicInfo;

  @ApiPropertyOptional({ type: [TrackBasicInfo] })
  @Type(() => TrackBasicInfo)
  tracks?: TrackBasicInfo[];

  @ApiPropertyOptional()
  trackCount?: number;

  @ApiPropertyOptional()
  totalDuration?: number;

  @ApiPropertyOptional()
  totalPlays?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

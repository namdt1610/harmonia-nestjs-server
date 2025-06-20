import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

class TrackBasicInfo {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  duration?: number;
}

class AlbumBasicInfo {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  releaseDate?: Date;
}

export class ArtistResponseDto {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional({ type: [TrackBasicInfo] })
  @Type(() => TrackBasicInfo)
  tracks?: TrackBasicInfo[];

  @ApiPropertyOptional({ type: [AlbumBasicInfo] })
  @Type(() => AlbumBasicInfo)
  albums?: AlbumBasicInfo[];

  @ApiPropertyOptional()
  trackCount?: number;

  @ApiPropertyOptional()
  albumCount?: number;

  @ApiPropertyOptional()
  totalPlays?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

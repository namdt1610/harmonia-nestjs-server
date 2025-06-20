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

class AlbumBasicInfo {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  image?: string;
}

class GenreBasicInfo {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  name: string;
}

export class TrackResponseDto {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  file?: string;

  @ApiPropertyOptional()
  video?: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  videoThumbnail?: string;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  lyrics?: string;

  @ApiProperty()
  playCount: number;

  @ApiProperty()
  downloadCount: number;

  @ApiProperty()
  isDownloadable: boolean;

  @ApiProperty({ type: ArtistBasicInfo })
  @Type(() => ArtistBasicInfo)
  artist: ArtistBasicInfo;

  @ApiPropertyOptional({ type: AlbumBasicInfo })
  @Type(() => AlbumBasicInfo)
  album?: AlbumBasicInfo;

  @ApiPropertyOptional({ type: [GenreBasicInfo] })
  @Type(() => GenreBasicInfo)
  genres?: GenreBasicInfo[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

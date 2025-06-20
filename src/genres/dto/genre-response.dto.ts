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

  artist?: {
    id: string;
    name: string;
    image?: string;
  };
}

export class GenreResponseDto {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ type: [TrackBasicInfo] })
  @Type(() => TrackBasicInfo)
  tracks?: TrackBasicInfo[];

  @ApiPropertyOptional()
  trackCount?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

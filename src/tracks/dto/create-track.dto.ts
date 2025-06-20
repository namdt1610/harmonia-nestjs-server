import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTrackDto {
  @ApiProperty({ example: 'Bohemian Rhapsody' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'https://example.com/track.mp3' })
  @IsOptional()
  @IsString()
  file?: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg' })
  @IsOptional()
  @IsString()
  videoThumbnail?: string;

  @ApiPropertyOptional({ example: 355, description: 'Duration in seconds' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  duration?: number;

  @ApiPropertyOptional({
    example: 'Is this the real life? Is this just fantasy?',
  })
  @IsOptional()
  @IsString()
  lyrics?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDownloadable?: boolean;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  artist: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439012' })
  @IsOptional()
  @IsMongoId()
  album?: string;

  @ApiPropertyOptional({
    example: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014'],
    description: 'Array of genre IDs',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  genres?: string[];
}

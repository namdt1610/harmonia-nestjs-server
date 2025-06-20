import { IsString, IsOptional, IsDateString, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAlbumDto {
  @ApiProperty({ example: 'A Night at the Opera' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'https://example.com/album-cover.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: '1975-11-21T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiPropertyOptional({ example: 'The fourth studio album by Queen' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  artist: string;
}

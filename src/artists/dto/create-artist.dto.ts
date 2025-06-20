import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({ example: 'Queen' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'British rock band formed in London in 1970',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/artist-image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}

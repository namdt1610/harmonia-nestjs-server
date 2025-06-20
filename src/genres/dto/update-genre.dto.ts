import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGenreDto {
  @ApiPropertyOptional({ example: 'Rock' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'A genre of popular music that originated in the 1950s',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

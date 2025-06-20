import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({ example: 'Rock' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'A genre of popular music that originated in the 1950s',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

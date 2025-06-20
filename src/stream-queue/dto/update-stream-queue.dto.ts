import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  IsString,
  IsBoolean,
  IsNumber,
  IsIn,
} from 'class-validator';

export class UpdateStreamQueueDto {
  @ApiProperty({
    description: 'Array of track IDs in the queue',
    type: [String],
    example: ['cm123abc456def790', 'cm123abc456def791'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tracks?: string[];

  @ApiProperty({
    description: 'Current index of the playing track',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  currentIndex?: number;

  @ApiProperty({
    description: 'Whether shuffle is enabled',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  shuffle?: boolean;

  @ApiProperty({
    description: 'Repeat mode: off, track, or playlist',
    example: 'off',
    enum: ['off', 'track', 'playlist'],
    required: false,
  })
  @IsOptional()
  @IsIn(['off', 'track', 'playlist'])
  repeat?: string;
}

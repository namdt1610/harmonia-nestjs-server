import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateStreamQueueDto {
  @ApiProperty({
    description: 'The ID of the user who owns this stream queue',
    example: 'cm123abc456def789',
  })
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiProperty({
    description: 'Array of track IDs in the queue',
    type: [String],
    example: ['cm123abc456def790', 'cm123abc456def791'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tracks?: string[];

  @ApiProperty({
    description: 'Current index of the playing track',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  currentIndex?: number;

  @ApiProperty({
    description: 'Whether shuffle is enabled',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  shuffle?: boolean;

  @ApiProperty({
    description: 'Repeat mode: off, track, or playlist',
    example: 'off',
    enum: ['off', 'track', 'playlist'],
    default: 'off',
  })
  @IsOptional()
  @IsIn(['off', 'track', 'playlist'])
  repeat?: string;
}

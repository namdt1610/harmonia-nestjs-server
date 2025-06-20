import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FavoriteType } from '../favorite.repository';

export class CreateFavoriteDto {
  @ApiProperty({
    description: 'The ID of the user adding the favorite',
    example: 'cluxy1234567890abcdefgh',
  })
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiProperty({
    description: 'The type of item being favorited',
    enum: FavoriteType,
    example: FavoriteType.TRACK,
  })
  @IsEnum(FavoriteType)
  type: FavoriteType;

  @ApiProperty({
    description: 'The ID of the item being favorited',
    example: 'cluxy1234567890abcdefgi',
  })
  @IsNotEmpty()
  @IsString()
  itemId: string;
}

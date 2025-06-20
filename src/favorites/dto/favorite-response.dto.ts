import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { FavoriteType } from '../../schemas/favorite.schema';

class UserInfo {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

class TrackInfo {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  duration: number;
}

class ArtistInfo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string;
}

class AlbumInfo {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  image: string;
}

class PlaylistInfo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  isPublic: boolean;
}

export class FavoriteResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the favorite',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({
    description: 'The user who added the favorite',
    type: UserInfo,
  })
  @Expose()
  @Type(() => UserInfo)
  user: UserInfo;

  @ApiProperty({
    description: 'The type of item being favorited',
    enum: FavoriteType,
    example: FavoriteType.TRACK,
  })
  @Expose()
  type: FavoriteType;

  @ApiProperty({
    description: 'The ID of the favorited item',
    example: '507f1f77bcf86cd799439012',
  })
  @Expose()
  @Transform(({ value }) => value?.toString())
  itemId: string;

  @ApiProperty({
    description: 'The detailed information of the favorited item',
    oneOf: [
      { $ref: '#/components/schemas/TrackInfo' },
      { $ref: '#/components/schemas/ArtistInfo' },
      { $ref: '#/components/schemas/AlbumInfo' },
      { $ref: '#/components/schemas/PlaylistInfo' },
    ],
  })
  @Expose()
  item?: TrackInfo | ArtistInfo | AlbumInfo | PlaylistInfo;

  @ApiProperty({
    description: 'When the item was added to favorites',
    example: '2023-12-01T12:00:00.000Z',
  })
  @Expose()
  addedAt: Date;

  @ApiProperty({
    description: 'When the favorite was created',
    example: '2023-12-01T12:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'When the favorite was last updated',
    example: '2023-12-01T12:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @Exclude()
  password: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isStaff: boolean;

  @ApiProperty()
  isSuperuser: boolean;

  @ApiProperty()
  dateJoined: Date;

  @ApiPropertyOptional()
  lastLogin?: Date;

  @ApiPropertyOptional()
  bio?: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  fullName?: string;

  @ApiPropertyOptional()
  playlistCount?: number;

  @ApiPropertyOptional()
  favoriteTracksCount?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

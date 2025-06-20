import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Artist, ArtistSchema } from '../schemas/artist.schema';
import { Track, TrackSchema } from '../schemas/track.schema';
import { Album, AlbumSchema } from '../schemas/album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Track.name, schema: TrackSchema },
      { name: Album.name, schema: AlbumSchema },
    ]),
  ],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsService],
})
export class ArtistsModule {}

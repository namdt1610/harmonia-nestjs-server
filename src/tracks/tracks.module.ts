import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { Track, TrackSchema } from '../schemas/track.schema';
import { Artist, ArtistSchema } from '../schemas/artist.schema';
import { Album, AlbumSchema } from '../schemas/album.schema';
import { Genre, GenreSchema } from '../schemas/genre.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Genre.name, schema: GenreSchema },
    ]),
  ],
  providers: [TracksService],
  controllers: [TracksController],
  exports: [TracksService],
})
export class TracksModule {}

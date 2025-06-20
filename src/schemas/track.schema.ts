import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type TrackDocument = Track & Document;

@Schema({
  timestamps: true,
  collection: 'tracks',
})
export class Track {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  file?: string; // File path/URL

  @Prop()
  video?: string; // Video file path/URL

  @Prop()
  image?: string; // Track cover image

  @Prop()
  videoThumbnail?: string;

  @Prop()
  duration?: number; // Duration in seconds

  @Prop()
  lyrics?: string;

  @Prop({ default: 0 })
  playCount: number;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop({ default: true })
  isDownloadable: boolean;

  // References to other collections
  @Prop({ type: Types.ObjectId, ref: 'Artist', required: true })
  artist: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Album' })
  album?: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Genre' }])
  genres: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Playlist' }])
  playlists: Types.ObjectId[];

  // Methods
  incrementPlayCount(): void {
    this.playCount += 1;
  }

  incrementDownloadCount(): void {
    this.downloadCount += 1;
  }
}

export const TrackSchema = SchemaFactory.createForClass(Track);

// Add indexes
TrackSchema.index({ title: 1 });
TrackSchema.index({ artist: 1 });
TrackSchema.index({ album: 1 });

// Transform _id to id when serializing
TrackSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

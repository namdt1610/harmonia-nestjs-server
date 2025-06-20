import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type PlaylistDocument = Playlist & Document;

@Schema({
  timestamps: true,
  collection: 'playlists',
})
export class Playlist {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: 0 })
  followers: number;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  // References to other collections
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Track' }])
  tracks: Types.ObjectId[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

// Add indexes
PlaylistSchema.index({ name: 1 });
PlaylistSchema.index({ user: 1 });

// Transform _id to id when serializing
PlaylistSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

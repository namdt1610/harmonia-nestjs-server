import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type AlbumDocument = Album & Document;

@Schema({
  timestamps: true,
  collection: 'albums',
})
export class Album {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  image?: string;

  @Prop()
  releaseDate?: Date;

  @Prop()
  description?: string;

  // References to other collections
  @Prop({ type: Types.ObjectId, ref: 'Artist', required: true })
  artist: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Track' }])
  tracks: Types.ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

// Add indexes
AlbumSchema.index({ title: 1 });
AlbumSchema.index({ artist: 1 });

// Transform _id to id when serializing
AlbumSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

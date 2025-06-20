import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type ArtistDocument = Artist & Document;

@Schema({
  timestamps: true,
  collection: 'artists',
})
export class Artist {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 'No bio available' })
  bio?: string;

  @Prop()
  image?: string;

  // References to other collections
  @Prop([{ type: Types.ObjectId, ref: 'Track' }])
  tracks: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Album' }])
  albums: Types.ObjectId[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);

// Add indexes
ArtistSchema.index({ name: 1 });

// Transform _id to id when serializing
ArtistSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

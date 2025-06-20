import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export enum FavoriteType {
  TRACK = 'TRACK',
  ARTIST = 'ARTIST',
  ALBUM = 'ALBUM',
  PLAYLIST = 'PLAYLIST',
}

export type FavoriteDocument = Favorite & Document;

@Schema({
  timestamps: true,
  collection: 'favorites',
})
export class Favorite {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, enum: FavoriteType, required: true })
  type: FavoriteType;

  @Prop({ required: true })
  itemId: Types.ObjectId; // ID of the favorited item

  @Prop({ default: Date.now })
  addedAt: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

// Add indexes
FavoriteSchema.index({ user: 1, type: 1 });
FavoriteSchema.index({ user: 1, itemId: 1 }, { unique: true });

// Transform _id to id when serializing
FavoriteSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

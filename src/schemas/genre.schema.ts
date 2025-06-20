import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type GenreDocument = Genre & Document;

@Schema({
  timestamps: true,
  collection: 'genres',
})
export class Genre {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  // References to other collections
  @Prop([{ type: Types.ObjectId, ref: 'Track' }])
  tracks: Types.ObjectId[];
}

export const GenreSchema = SchemaFactory.createForClass(Genre);

// Add indexes
GenreSchema.index({ name: 1 });

// Transform _id to id when serializing
GenreSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

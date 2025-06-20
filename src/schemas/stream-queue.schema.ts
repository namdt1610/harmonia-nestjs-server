import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type StreamQueueDocument = StreamQueue & Document;

@Schema({
  timestamps: true,
  collection: 'stream_queues',
})
export class StreamQueue {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Track' }])
  tracks: Types.ObjectId[];

  @Prop({ default: 0 })
  currentIndex: number;

  @Prop({ default: false })
  shuffle: boolean;

  @Prop({ default: 'off' }) // 'off', 'track', 'playlist'
  repeat: string;

  @Prop({ default: Date.now })
  lastPlayed: Date;
}

export const StreamQueueSchema = SchemaFactory.createForClass(StreamQueue);

// Add indexes
StreamQueueSchema.index({ user: 1 });

// Transform _id to id when serializing
StreamQueueSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

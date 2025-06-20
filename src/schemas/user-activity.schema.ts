import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export enum ActivityType {
  PLAY = 'PLAY',
  DOWNLOAD = 'DOWNLOAD',
  LIKE = 'LIKE',
  SKIP = 'SKIP',
  SHARE = 'SHARE',
  PLAYLIST_CREATE = 'PLAYLIST_CREATE',
  PLAYLIST_ADD = 'PLAYLIST_ADD',
  SEARCH = 'SEARCH',
}

export type UserActivityDocument = UserActivity & Document;

@Schema({
  timestamps: true,
  collection: 'user_activities',
})
export class UserActivity {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: String, enum: ActivityType, required: true })
  activityType: ActivityType;

  @Prop({ type: Object })
  metadata?: any; // Additional data about the activity

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  // References to other collections
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Track' })
  track?: Types.ObjectId;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);

// Add indexes
UserActivitySchema.index({ user: 1, activityType: 1 });
UserActivitySchema.index({ createdAt: 1 });

// Transform _id to id when serializing
UserActivitySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

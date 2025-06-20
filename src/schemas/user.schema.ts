import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  @Exclude()
  password?: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isStaff: boolean;

  @Prop({ default: false })
  isSuperuser: boolean;

  @Prop({ default: Date.now })
  dateJoined: Date;

  @Prop()
  lastLogin?: Date;

  @Prop()
  bio?: string;

  @Prop()
  image?: string;

  @Prop()
  googleSub?: string;

  // References to other collections
  @Prop([{ type: Types.ObjectId, ref: 'Playlist' }])
  playlists: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Track' }])
  favoriteTracks: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Artist' }])
  favoriteArtists: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Album' }])
  favoriteAlbums: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'UserSubscription' })
  subscription?: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'UserActivity' }])
  activities: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Track' }])
  recentlyPlayed: Types.ObjectId[];

  // Virtual fields
  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual for fullName
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Add indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Transform _id to id when serializing
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

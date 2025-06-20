import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
}

export type UserSubscriptionDocument = UserSubscription & Document;

@Schema({
  timestamps: true,
  collection: 'user_subscriptions',
})
export class UserSubscription {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({
    type: String,
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  // Subscription period
  @Prop({ default: Date.now })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  trialEndDate?: Date;

  // Billing
  @Prop({ default: true })
  autoRenew: boolean;

  @Prop()
  paymentMethod?: string; // STRIPE, PAYPAL, etc.

  @Prop()
  externalSubscriptionId?: string; // Stripe subscription ID

  // Usage tracking
  @Prop({ default: 0 })
  offlineTracksDownloaded: number;

  @Prop({ default: 0 })
  playlistsCreated: number;

  @Prop({ default: 0 })
  skipsUsedToday: number;

  @Prop({ default: Date.now })
  lastSkipReset: Date;

  // References to other collections
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  plan: Types.ObjectId;

  // Computed properties and methods
  get isActive(): boolean {
    const now = new Date();
    return (
      this.status === SubscriptionStatus.ACTIVE &&
      this.endDate > now &&
      (!this.trialEndDate || this.trialEndDate > now)
    );
  }

  get isTrial(): boolean {
    const now = new Date();
    return (
      this.status === SubscriptionStatus.TRIAL &&
      this.trialEndDate &&
      this.trialEndDate > now
    );
  }

  get daysRemaining(): number {
    if (!this.isActive) return 0;
    const now = new Date();
    const timeDiff = this.endDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}

export const UserSubscriptionSchema =
  SchemaFactory.createForClass(UserSubscription);

// Add virtuals
UserSubscriptionSchema.virtual('isActive').get(function () {
  const now = new Date();
  return (
    this.status === SubscriptionStatus.ACTIVE &&
    this.endDate > now &&
    (!this.trialEndDate || this.trialEndDate > now)
  );
});

UserSubscriptionSchema.virtual('isTrial').get(function () {
  const now = new Date();
  return (
    this.status === SubscriptionStatus.TRIAL &&
    this.trialEndDate &&
    this.trialEndDate > now
  );
});

UserSubscriptionSchema.virtual('daysRemaining').get(function () {
  const now = new Date();
  const timeDiff = this.endDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Add indexes
UserSubscriptionSchema.index({ user: 1 });
UserSubscriptionSchema.index({ status: 1 });

// Transform _id to id when serializing
UserSubscriptionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

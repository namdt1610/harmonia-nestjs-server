import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export enum PlanType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  FAMILY = 'FAMILY',
  STUDENT = 'STUDENT',
  ARTIST = 'ARTIST',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  LIFETIME = 'LIFETIME',
}

export enum AudioQuality {
  STANDARD = 'STANDARD',
  HIGH = 'HIGH',
  LOSSLESS = 'LOSSLESS',
}

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema({
  timestamps: true,
  collection: 'subscription_plans',
})
export class SubscriptionPlan {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: PlanType, required: true })
  planType: PlanType;

  @Prop({ type: String, enum: BillingCycle, required: true })
  billingCycle: BillingCycle;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'USD' })
  currency: string;

  // Features
  @Prop({ default: 0 }) // 0 = unlimited
  maxOfflineTracks: number;

  @Prop({ type: String, enum: AudioQuality, default: AudioQuality.STANDARD })
  audioQuality: AudioQuality;

  @Prop({ default: false })
  adsFree: boolean;

  @Prop({ default: 6 }) // per hour, 0 = unlimited
  skipLimit: number;

  @Prop({ default: false })
  canDownload: boolean;

  @Prop({ default: true })
  canCreatePlaylists: boolean;

  @Prop({ default: 20 }) // 0 = unlimited
  maxPlaylists: number;

  @Prop({ default: 1 })
  familyAccounts: number;

  @Prop({ default: false })
  canUploadMusic: boolean;

  @Prop({ default: false })
  analyticsAccess: boolean;

  @Prop({ default: false })
  prioritySupport: boolean;

  // Plan details
  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  featuresList: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  // References to other collections
  @Prop([{ type: Types.ObjectId, ref: 'UserSubscription' }])
  subscriptions: Types.ObjectId[];

  // Computed property
  get monthlyPrice(): number {
    if (this.billingCycle === BillingCycle.YEARLY) {
      return this.price / 12;
    } else if (this.billingCycle === BillingCycle.LIFETIME) {
      return this.price / 120; // Assume 10 years
    }
    return this.price;
  }
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);

// Add virtual for monthlyPrice
SubscriptionPlanSchema.virtual('monthlyPrice').get(function () {
  if (this.billingCycle === BillingCycle.YEARLY) {
    return this.price / 12;
  } else if (this.billingCycle === BillingCycle.LIFETIME) {
    return this.price / 120; // Assume 10 years
  }
  return this.price;
});

// Transform _id to id when serializing
SubscriptionPlanSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserSubscription } from './user-subscription.entity';

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

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: PlanType,
    name: 'plan_type',
  })
  planType: PlanType;

  @Column({
    type: 'enum',
    enum: BillingCycle,
    name: 'billing_cycle',
  })
  billingCycle: BillingCycle;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  // Features
  @Column({
    name: 'max_offline_tracks',
    type: 'int',
    default: 0,
    comment: '0 = unlimited',
  })
  maxOfflineTracks: number;

  @Column({
    type: 'enum',
    enum: AudioQuality,
    name: 'audio_quality',
    default: AudioQuality.STANDARD,
  })
  audioQuality: AudioQuality;

  @Column({ name: 'ads_free', default: false })
  adsFree: boolean;

  @Column({
    name: 'skip_limit',
    type: 'int',
    default: 6,
    comment: 'per hour, 0 = unlimited',
  })
  skipLimit: number;

  @Column({ name: 'can_download', default: false })
  canDownload: boolean;

  @Column({ name: 'can_create_playlists', default: true })
  canCreatePlaylists: boolean;

  @Column({
    name: 'max_playlists',
    type: 'int',
    default: 20,
    comment: '0 = unlimited',
  })
  maxPlaylists: number;

  @Column({ name: 'family_accounts', type: 'int', default: 1 })
  familyAccounts: number;

  @Column({ name: 'can_upload_music', default: false })
  canUploadMusic: boolean;

  @Column({ name: 'analytics_access', default: false })
  analyticsAccess: boolean;

  @Column({ name: 'priority_support', default: false })
  prioritySupport: boolean;

  // Plan details
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', name: 'features_list', default: [] })
  featuresList: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => UserSubscription, (subscription) => subscription.plan)
  subscriptions: UserSubscription[];

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

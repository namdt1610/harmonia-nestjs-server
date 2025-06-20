import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
}

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  // Subscription period
  @Column({
    name: 'start_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ name: 'trial_end_date', type: 'timestamp', nullable: true })
  trialEndDate?: Date;

  // Billing
  @Column({ name: 'auto_renew', default: true })
  autoRenew: boolean;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod?: string; // STRIPE, PAYPAL, etc.

  @Column({ name: 'external_subscription_id', nullable: true })
  externalSubscriptionId?: string; // Stripe subscription ID

  // Usage tracking
  @Column({ name: 'offline_tracks_downloaded', type: 'int', default: 0 })
  offlineTracksDownloaded: number;

  @Column({ name: 'playlists_created', type: 'int', default: 0 })
  playlistsCreated: number;

  @Column({ name: 'skips_used_today', type: 'int', default: 0 })
  skipsUsedToday: number;

  @Column({
    name: 'last_skip_reset',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  lastSkipReset: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

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

  canSkipTracks(): boolean {
    const today = new Date().toDateString();
    if (this.lastSkipReset.toDateString() !== today) {
      this.skipsUsedToday = 0;
      this.lastSkipReset = new Date();
    }

    if (this.plan.skipLimit === 0) {
      // Unlimited
      return true;
    }
    return this.skipsUsedToday < this.plan.skipLimit;
  }

  useSkip(): boolean {
    if (this.canSkipTracks() && this.plan.skipLimit > 0) {
      this.skipsUsedToday += 1;
      return true;
    }
    return false;
  }

  canDownloadTracks(): boolean {
    if (!this.plan.canDownload) {
      return false;
    }
    if (this.plan.maxOfflineTracks === 0) {
      // Unlimited
      return true;
    }
    return this.offlineTracksDownloaded < this.plan.maxOfflineTracks;
  }

  canCreatePlaylist(): boolean {
    if (this.plan.maxPlaylists === 0) {
      // Unlimited
      return true;
    }
    return this.playlistsCreated < this.plan.maxPlaylists;
  }
}

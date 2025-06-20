import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Track } from './track.entity';

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

@Entity('user_activities')
@Index(['user', 'activityType'])
@Index(['createdAt'])
export class UserActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
    name: 'activity_type',
  })
  activityType: ActivityType;

  @Column({ type: 'json', nullable: true })
  metadata?: any; // Additional data about the activity

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.activities, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Track, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'track_id' })
  track?: Track;
}

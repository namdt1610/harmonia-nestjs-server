import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Playlist } from './playlist.entity';
import { Track } from './track.entity';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { UserSubscription } from './user-subscription.entity';
import { UserActivity } from './user-activity.entity';

@Entity('users')
@Index(['email'])
@Index(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password?: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_staff', default: false })
  isStaff: boolean;

  @Column({ name: 'is_superuser', default: false })
  isSuperuser: boolean;

  @Column({
    name: 'date_joined',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateJoined: Date;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin?: Date;

  // Profile fields
  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'google_sub', nullable: true })
  googleSub?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'user_favorite_tracks',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
  })
  favoriteTracks: Track[];

  @ManyToMany(() => Artist)
  @JoinTable({
    name: 'user_favorite_artists',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'artist_id', referencedColumnName: 'id' },
  })
  favoriteArtists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable({
    name: 'user_favorite_albums',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'album_id', referencedColumnName: 'id' },
  })
  favoriteAlbums: Album[];

  @OneToOne(() => UserSubscription, (subscription) => subscription.user)
  subscription?: UserSubscription;

  @OneToMany(() => UserActivity, (activity) => activity.user)
  activities: UserActivity[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'user_recently_played',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
  })
  recentlyPlayed: Track[];

  // Virtual fields
  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}

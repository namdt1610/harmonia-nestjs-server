import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Track } from './track.entity';

@Entity('albums')
@Index(['title'])
@Unique(['title', 'artist'])
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate?: Date;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Artist, (artist) => artist.albums, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];
}

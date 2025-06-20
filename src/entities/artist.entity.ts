import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Track } from './track.entity';
import { Album } from './album.entity';

@Entity('artists')
@Index(['name'])
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true, default: 'No bio available' })
  bio?: string;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];
}

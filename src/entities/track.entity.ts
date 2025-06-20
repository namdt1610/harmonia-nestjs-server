import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Genre } from './genre.entity';
import { Playlist } from './playlist.entity';

@Entity('tracks')
@Index(['title'])
@Index(['artist'])
@Index(['album'])
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  file?: string; // File path/URL

  @Column({ nullable: true })
  video?: string; // Video file path/URL

  @Column({ nullable: true })
  image?: string; // Track cover image

  @Column({ name: 'video_thumbnail', nullable: true })
  videoThumbnail?: string;

  @Column({ type: 'int', nullable: true, comment: 'Duration in seconds' })
  duration?: number;

  @Column({ type: 'text', nullable: true })
  lyrics?: string;

  @Column({ name: 'play_count', type: 'int', default: 0 })
  playCount: number;

  @Column({ name: 'download_count', type: 'int', default: 0 })
  downloadCount: number;

  @Column({ name: 'is_downloadable', default: true })
  isDownloadable: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Artist, (artist) => artist.tracks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Album, (album) => album.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'album_id' })
  album?: Album;

  @ManyToMany(() => Genre, (genre) => genre.tracks)
  @JoinTable({
    name: 'track_genres',
    joinColumn: { name: 'track_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @ManyToMany(() => Playlist, (playlist) => playlist.tracks)
  playlists: Playlist[];

  // Methods
  incrementPlayCount(): void {
    this.playCount += 1;
  }

  incrementDownloadCount(): void {
    this.downloadCount += 1;
  }
}

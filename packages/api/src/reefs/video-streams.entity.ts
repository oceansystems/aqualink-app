import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GeoJSON } from 'geojson';

@Entity()
export class VideoStream {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerEmail: string;

  @Column('point')
  @Index({ spatial: true })
  location: GeoJSON;

  @Column()
  url: string;

  @Column({ default: 1 })
  quality: number;

  @Column()
  important: boolean;

  @Column()
  hidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

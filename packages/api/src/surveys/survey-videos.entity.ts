import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GeoJSON } from 'geojson';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';
import { Survey } from './surveys.entity';
import { User } from '../users/users.entity';

@Entity()
export class SurveyVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('point')
  @Index({ spatial: true })
  location: GeoJSON;

  @Column()
  url: string;

  @Column()
  startTimestamp: Date;

  @Column()
  endTimestamp: Date;

  @Column()
  uploadTimestamp: Date;

  @Column({ default: 1 })
  quality: number;

  @Column()
  important: boolean;

  @Column()
  hidden: boolean;

  @Column('json')
  metadata: string;

  @ManyToOne(() => Survey, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'survey_id' })
  surveyId: Survey;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => ReefPointOfInterest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poiId: ReefPointOfInterest;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

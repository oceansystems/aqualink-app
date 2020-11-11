import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Survey } from './surveys.entity';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';

export enum Observations {
  Healthy = 'healthy',
  PossibleDisease = 'possible-disease',
  EvidentDisease = 'evident-disease',
  Mortality = 'mortality',
  Environmental = 'environmental',
  Anthropogenic = 'anthropogenic',
}

export enum MediaType {
  Video = 'video',
  Image = 'image',
}

@Entity()
export class SurveyMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 1 })
  quality: number;

  @Column()
  featured: boolean;

  @Column()
  hidden: boolean;

  @Column('json')
  metadata: string;

  @Column({
    type: 'enum',
    enum: Observations,
  })
  observations: Observations;

  @Column({ nullable: true })
  comments: string;

  @ManyToOne(() => Survey, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'survey_id' })
  surveyId: Survey;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @ManyToOne(() => ReefPointOfInterest, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'poi_id' })
  poiId?: ReefPointOfInterest;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

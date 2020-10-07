import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Reef } from '../reefs/reefs.entity';
import { User } from '../users/users.entity';
import { DailyData } from '../reefs/daily-data.entity';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';
import { Observations, SurveyMedia } from './survey-media.entity';

export enum WeatherConditions {
  Calm = 'calm',
  Wavy = 'waves',
  Stormy = 'storm',
}

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'weather_conditions',
    type: 'enum',
    enum: WeatherConditions,
  })
  weatherConditions: WeatherConditions;

  @Column('float', { nullable: true })
  temperature?: number;

  @Column('text', { nullable: true })
  comments?: string;

  @Column()
  diveDate: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId?: User;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reef_id' })
  reef?: Reef;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToOne(() => SurveyMedia, (surveyMedia) => surveyMedia.surveyId)
  featuredSurveyMedia?: SurveyMedia;

  @OneToMany(() => SurveyMedia, (surveyMedia) => surveyMedia.surveyId)
  surveyMedia?: SurveyMedia[];

  latestDailyData?: DailyData;

  surveyPoints?: ReefPointOfInterest[];

  observations?: Observations[];
}

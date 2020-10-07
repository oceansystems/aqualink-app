import { GeoJSON } from 'geojson';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Region } from '../regions/regions.entity';
import { DailyData } from './daily-data.entity';
import { VideoStream } from './video-streams.entity';
import { Survey } from '../surveys/surveys.entity';
import { User } from '../users/users.entity';

@Entity()
export class Reef {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  spotterId: string;

  @Column({
    type: 'geometry',
    unique: true,
    srid: 4326,
  })
  @Index({ spatial: true })
  polygon: GeoJSON;

  @Column('float', { nullable: true })
  temperatureThreshold: number;

  @Column({ nullable: true })
  depth: number;

  @Column({ default: 0 })
  status: number;

  @Column({ nullable: true })
  videoStream: string;

  @Column('float', { nullable: true })
  maxMonthlyMean: number;

  @Column({ nullable: true })
  timezone: string;

  @Column({ default: true })
  approved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Region, { onDelete: 'SET NULL', nullable: true })
  region?: Region;

  @ManyToOne(() => VideoStream, { onDelete: 'SET NULL', nullable: true })
  stream?: VideoStream;

  @ManyToMany(() => User, (user) => user.administeredReefs)
  admins: User[];

  @OneToOne(() => DailyData, (latestDailyData) => latestDailyData.reef)
  latestDailyData?: DailyData;

  @OneToMany(() => Survey, (survey) => survey.reef)
  surveys: Survey[];
}

import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';
import { Reef } from './reefs.entity';
import { SourceType } from './schemas/source-type.enum';

@Entity()
@Unique('no_duplicate_sources', ['reef', 'poi', 'type'])
@Index(['reef', 'type'], { unique: true, where: '"poi_id" IS NULL' })
export class Sources {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE' })
  reef: Reef;

  @ManyToOne(() => ReefPointOfInterest, { onDelete: 'CASCADE', nullable: true })
  poi: ReefPointOfInterest | null;

  @Column({ type: 'enum', enum: SourceType })
  type: SourceType;

  @ApiProperty({ example: 12 })
  @Column('float', { nullable: true })
  depth: number | null;

  @ApiProperty({ example: 'SPOT-0000' })
  @Column({ nullable: true, type: 'character varying' })
  sensorId: string | null;
}

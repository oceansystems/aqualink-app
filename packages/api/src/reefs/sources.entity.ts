import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';
import { Reef } from './reefs.entity';

export enum SourceType {
  SPOTTER = 'spotter',
  HOBO = 'hobo',
  SOFAR_API = 'sofar_api',
}

@Entity()
export class Sources {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE' })
  reef: Reef;

  @ManyToOne(() => ReefPointOfInterest, { onDelete: 'CASCADE', nullable: true })
  poi: ReefPointOfInterest;

  @Column({ type: 'enum', enum: SourceType })
  type: SourceType;

  @Column('float', { nullable: true })
  depth: number;

  @Column({ nullable: true })
  spotterId: string;
}
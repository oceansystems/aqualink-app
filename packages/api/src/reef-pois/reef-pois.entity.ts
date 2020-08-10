import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reef } from '../reefs/reefs.entity';

@Entity()
export class ReefPointOfInterest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  poiLabelId: number;

  @Column()
  imageUrl: string;

  @Column()
  name: string;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reef_id' })
  reefId: Reef;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

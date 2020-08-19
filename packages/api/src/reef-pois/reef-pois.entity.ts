import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reef } from '../reefs/reefs.entity';

@Entity()
export class ReefPointOfInterest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  poiLabelId: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  name: string;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE' })
  reef: Reef;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

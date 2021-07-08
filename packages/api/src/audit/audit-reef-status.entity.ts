import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reef, ReefStatus } from '../reefs/reefs.entity';

@Entity()
export class AuditReefStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  oldStatus: ReefStatus;

  @Index()
  @Column()
  newStatus: ReefStatus;

  @ManyToOne(() => Reef, { nullable: false, onDelete: 'CASCADE' })
  reef: Reef;

  @Column({ nullable: true })
  sensorId?: string;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

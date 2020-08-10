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
import { User } from '../users/users.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  temperature: number;

  @Column('text')
  observations: string;

  @Column()
  diveDate: Date;

  @Column()
  uploadDate: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE' })
  reef: Reef;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

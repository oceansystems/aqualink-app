import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Reef } from '../reefs/reefs.entity';
import { User } from '../users/users.entity';
import { hashId } from '../utils/urls';

@Entity()
export class ReefApplication {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  permitRequirements: string;

  @Column({ nullable: true })
  fundingSource: string;

  @Column({ nullable: true })
  installationSchedule: Date;

  @Column({ nullable: true })
  installationResources: string;

  @Exclude()
  @Column({ default: () => 'gen_random_uuid()', unique: true })
  uid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE' })
  reef: Reef;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Expose()
  get appId(): string {
    return hashId(this.id);
  }
}

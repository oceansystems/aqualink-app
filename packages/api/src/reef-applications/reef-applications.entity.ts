import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Reef } from '../reefs/reefs.entity';
import { User } from '../users/users.entity';
import { hashId } from '../utils/urls';

@Entity()
export class ReefApplication {
  @ApiProperty({ example: 1 })
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Permit Requirements' })
  @Column({ nullable: true, type: 'character varying' })
  permitRequirements: string | null;

  @ApiProperty({ example: 'Funding Source' })
  @Column({ nullable: true, type: 'character varying' })
  fundingSource: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  installationSchedule: Date | null;

  @ApiProperty({ example: 'Installation Resource' })
  @Column({ nullable: true, type: 'character varying' })
  installationResources: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  targetShipdate: Date | null;

  @ApiProperty({ example: 'Tracking URL' })
  @Column({ nullable: true, type: 'character varying' })
  trackingUrl: string | null;

  @Exclude()
  @Column({ default: () => 'gen_random_uuid()', unique: true })
  uid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Reef, { onDelete: 'CASCADE' })
  @JoinColumn()
  reef: Reef;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Expose()
  get appId(): string {
    return hashId(this.id);
  }

  @Expose()
  get applied(): boolean {
    return !!this.permitRequirements;
  }
}

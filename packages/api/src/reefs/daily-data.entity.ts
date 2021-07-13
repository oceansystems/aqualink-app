import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reef } from './reefs.entity';

@Entity()
export class DailyData {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ApiProperty({ example: 30 })
  @Column('float', { nullable: true })
  minBottomTemperature: number | null;

  @ApiProperty({ example: 32 })
  @Column('float', { nullable: true })
  maxBottomTemperature: number | null;

  @ApiProperty({ example: 31 })
  @Column('float', { nullable: true })
  avgBottomTemperature: number | null;

  @ApiProperty({ example: 20 })
  @Column('float', { nullable: true })
  degreeHeatingDays: number | null;

  @ApiProperty({ example: 22 })
  @Column('float', { nullable: true })
  topTemperature: number | null;

  @ApiProperty({ example: 21 })
  @Column('float', { nullable: true })
  satelliteTemperature: number | null;

  @ApiProperty({ example: 2 })
  @Column('float', { nullable: true })
  minWaveHeight: number | null;

  @ApiProperty({ example: 4 })
  @Column('float', { nullable: true })
  maxWaveHeight: number | null;

  @ApiProperty({ example: 3 })
  @Column('float', { nullable: true })
  avgWaveHeight: number | null;

  @ApiProperty({ example: 279 })
  @Column({ nullable: true, type: 'integer' })
  waveDirection: number | null;

  @ApiProperty({ example: 11 })
  @Column({ nullable: true, type: 'integer' })
  wavePeriod: number | null;

  @ApiProperty({ example: 1 })
  @Column('float', { nullable: true })
  minWindSpeed: number | null;

  @ApiProperty({ example: 3 })
  @Column('float', { nullable: true })
  maxWindSpeed: number | null;

  @ApiProperty({ example: 2 })
  @Column('float', { nullable: true })
  avgWindSpeed: number | null;

  @ApiProperty({ example: 1 })
  @Column({ nullable: true, type: 'integer' })
  windDirection: number | null;

  @ApiProperty({ example: 5 })
  @Column('integer', { nullable: true })
  dailyAlertLevel: number | null;

  @ApiProperty({ example: 5 })
  @Column('integer', { nullable: true })
  weeklyAlertLevel: number | null;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE' })
  reef: Reef;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

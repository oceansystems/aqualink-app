import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExclusionDates {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'SPOT-0000' })
  @Column()
  sensorId: string;

  // The start of the exclusive range. Inclusive
  @Column({ nullable: true, type: 'timestamp' })
  startDate: Date | null;

  // The end of the exclusive range. Inclusive
  @Column()
  endDate: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
} from 'typeorm';
import { GeoJSON } from 'geojson';
import { ApiProperty } from '@nestjs/swagger';
import { ApiPointProperty } from '../docs/api-properties';

@Entity()
export class Region {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'United States' })
  @Column({ nullable: false })
  name: string;

  @ApiPointProperty()
  @Column({
    type: 'geometry',
    unique: true,
    srid: 4326,
    nullable: false,
  })
  @Index({ spatial: true })
  polygon: GeoJSON | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => Region })
  @ManyToOne(() => Region, { onDelete: 'CASCADE', nullable: true })
  parent: Region | null;

  @ApiProperty({ example: 1 })
  @RelationId((region: Region) => region.parent)
  parentId?: number;
}

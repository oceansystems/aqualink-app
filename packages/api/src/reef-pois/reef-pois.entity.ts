import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  RelationId,
} from 'typeorm';
import { GeoJSON } from 'geojson';
import { ApiProperty } from '@nestjs/swagger';
import { Reef } from '../reefs/reefs.entity';
import { ApiPointProperty } from '../docs/api-properties';

@Entity()
export class ReefPointOfInterest {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: true, type: 'integer' })
  poiLabelId: number | null;

  @ApiProperty({ example: 'http://some-sample-url.com' })
  @Column({ nullable: true, type: 'character varying' })
  imageUrl: string | null;

  @ApiProperty({ example: 'Outer tide pool' })
  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE', nullable: false })
  reef: Reef;

  @ApiProperty({ example: 1 })
  @RelationId((poi: ReefPointOfInterest) => poi.reef)
  reefId: number;

  @ApiPointProperty()
  @Column({
    type: 'geometry',
    unique: true,
    srid: 4326,
    nullable: true,
  })
  @Index({ spatial: true })
  polygon: GeoJSON | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

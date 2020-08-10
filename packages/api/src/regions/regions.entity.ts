import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GeoJSON } from 'geojson';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('geometry', { spatialFeatureType: 'Polygon' })
  @Index({ spatial: true })
  polygon: GeoJSON;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Region, { onDelete: 'CASCADE', nullable: true })
  parent?: Region;
}

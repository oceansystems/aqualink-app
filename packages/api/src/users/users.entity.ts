import { GeoJSON } from 'geojson';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Reef } from '../reefs/reefs.entity';
import { ApiPointProperty } from '../docs/api-properties';

export enum AdminLevel {
  Default = 'default',
  ReefManager = 'reef_manager',
  SuperAdmin = 'super_admin',
}

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @Exclude()
  @Column({ nullable: true, select: false })
  firebaseUid?: string;

  @ApiProperty({ example: 'Full Name' })
  @Column({ nullable: true })
  fullName?: string;

  @ApiProperty({ example: 'fullname@example.com' })
  @Column()
  @Index({ unique: true })
  email: string;

  @ApiProperty({ example: 'Random organization' })
  @Column({ nullable: true })
  organization?: string;

  @ApiPointProperty()
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    nullable: true,
    srid: 4326,
  })
  @Index({ spatial: true })
  location?: GeoJSON;

  @ApiProperty({ example: 'Some country' })
  @Column({ nullable: true })
  country?: string;

  @Column({
    type: 'enum',
    enum: AdminLevel,
    default: AdminLevel.Default,
    nullable: false,
  })
  adminLevel: AdminLevel;

  @ApiProperty({ example: 'Some description' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ example: 'http://some-sample-url.com' })
  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToMany(() => Reef, (reef) => reef.admins, { cascade: true })
  @JoinTable()
  administeredReefs: Reef[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

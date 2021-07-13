import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Connection,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  ViewEntity,
} from 'typeorm';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';
import { Reef } from '../reefs/reefs.entity';
import { SourceType } from '../reefs/schemas/source-type.enum';
import { Metric } from './metrics.entity';
import { TimeSeries } from './time-series.entity';

@ViewEntity({
  expression: (connection: Connection) => {
    const subQuery = connection
      .createQueryBuilder()
      .select('DISTINCT ON (metric, source_id) metric', 'metric')
      .addSelect('id')
      .addSelect('timestamp')
      .addSelect('value')
      .addSelect('source_id')
      .from(TimeSeries, 'time_series')
      .orderBy('metric, source_id, timestamp', 'DESC');

    return connection
      .createQueryBuilder()
      .from(() => subQuery, 'time_series')
      .addSelect('reef_id')
      .addSelect('poi_id')
      .innerJoin('sources', 'source', 'source.id = time_series.source_id');
  },
  materialized: true,
})
export class LatestData {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  timestamp: Date;

  @ApiProperty({ example: 11.05 })
  @Column({ type: 'float', nullable: false })
  value: number;

  @ManyToOne(() => Reef, { onDelete: 'CASCADE', nullable: false })
  reef: Reef;

  @ApiProperty({ example: 15 })
  @RelationId((latestData: LatestData) => latestData.reef)
  reefId: number;

  @ManyToOne(() => ReefPointOfInterest, { onDelete: 'CASCADE', nullable: true })
  poi: ReefPointOfInterest | null;

  @Column({ type: 'enum', enum: SourceType })
  source: SourceType;

  @Column({ type: 'enum', enum: Metric })
  metric: Metric;
}

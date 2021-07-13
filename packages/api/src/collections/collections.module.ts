import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reef } from '../reefs/reefs.entity';
import { Sources } from '../reefs/sources.entity';
import { LatestData } from '../time-series/latest-data.entity';
import { EntityExists } from '../validations/entity-exists.constraint';
import { CollectionsController } from './collections.controller';
import { Collection } from './collections.entity';
import { CollectionsService } from './collections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, LatestData, Reef, Sources])],
  controllers: [CollectionsController],
  providers: [CollectionsService, EntityExists],
})
export class CollectionsModule {}

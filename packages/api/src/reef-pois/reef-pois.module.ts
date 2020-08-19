import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReefPoisController } from './reef-pois.controller';
import { ReefPoisService } from './reef-pois.service';
import { ReefPointOfInterest } from './reef-pois.entity';
import { EntityExists } from '../validations/entity-exists.constraint';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ReefPointOfInterest])],
  controllers: [ReefPoisController],
  providers: [ReefPoisService, EntityExists],
})
export class ReefPoisModule {}

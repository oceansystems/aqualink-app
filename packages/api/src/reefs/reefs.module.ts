import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReefsController } from './reefs.controller';
import { ReefsService } from './reefs.service';
import { Reef } from './reefs.entity';
import { DailyData } from './daily-data.entity';
import { EntityExists } from '../validations/entity-exists.constraint';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Reef, DailyData])],
  controllers: [ReefsController],
  providers: [ReefsService, EntityExists],
})
export class ReefsModule {}

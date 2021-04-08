import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReefsController } from './reefs.controller';
import { ReefsService } from './reefs.service';
import { Reef } from './reefs.entity';
import { DailyData } from './daily-data.entity';
import { EntityExists } from '../validations/entity-exists.constraint';
import { AuthModule } from '../auth/auth.module';
import { Region } from '../regions/regions.entity';
import { ExclusionDates } from './exclusion-dates.entity';
import { ReefApplication } from '../reef-applications/reef-applications.entity';
import { User } from '../users/users.entity';
import { MonthlyMax } from './monthly-max.entity';
import { Sources } from './sources.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Reef,
      ReefApplication,
      DailyData,
      Region,
      ExclusionDates,
      MonthlyMax,
      User,
      Sources,
    ]),
  ],
  controllers: [ReefsController],
  providers: [ReefsService, EntityExists],
})
export class ReefsModule {}

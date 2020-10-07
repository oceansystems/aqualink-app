import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReefApplicationsController } from './reef-applications.controller';
import { ReefApplicationsService } from './reef-applications.service';
import { EntityExists } from '../validations/entity-exists.constraint';
import { Reef } from '../reefs/reefs.entity';
import { ReefApplication } from './reef-applications.entity';
import { Region } from '../regions/regions.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/users.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Reef, ReefApplication, Region, User]),
  ],
  controllers: [ReefApplicationsController],
  providers: [ReefApplicationsService, EntityExists],
})
export class ReefApplicationsModule {}

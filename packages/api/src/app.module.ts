import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { ReefApplicationsModule } from './reef-applications/reef-applications.module';
import { ReefsModule } from './reefs/reefs.module';
import { ReefPoisModule } from './reef-pois/reef-pois.module';
import { RegionsModule } from './regions/regions.module';
import { SurveysModule } from './surveys/surveys.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ReefApplicationsModule,
    ReefsModule,
    ReefPoisModule,
    RegionsModule,
    SurveysModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}

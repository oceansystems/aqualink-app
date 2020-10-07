import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveysController } from './surveys.controller';
import { Survey } from './surveys.entity';
import { EntityExists } from '../validations/entity-exists.constraint';
import { AuthModule } from '../auth/auth.module';
import { SurveysService } from './surveys.service';
import { SurveyMedia } from './survey-media.entity';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';
import { GoogleCloudModule } from '../google-cloud/google-cloud.module';
import { GoogleCloudService } from '../google-cloud/google-cloud.service';
import { Reef } from '../reefs/reefs.entity';

@Module({
  imports: [
    AuthModule,
    GoogleCloudModule,
    TypeOrmModule.forFeature([Survey, SurveyMedia, ReefPointOfInterest, Reef]),
  ],
  controllers: [SurveysController],
  providers: [EntityExists, SurveysService, GoogleCloudService],
})
export class SurveysModule {}

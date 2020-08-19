import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveysController } from './surveys.controller';
import { Survey } from './surveys.entity';
import { EntityExists } from '../validations/entity-exists.constraint';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Survey])],
  controllers: [SurveysController],
  providers: [EntityExists],
})
export class SurveysModule {}

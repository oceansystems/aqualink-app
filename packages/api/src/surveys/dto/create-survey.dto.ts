import { IsDateString, IsEnum, IsString, IsOptional } from 'class-validator';
import { WeatherConditions } from '../surveys.entity';

export class CreateSurveyDto {
  @IsDateString()
  readonly diveDate: Date;

  @IsEnum(WeatherConditions)
  readonly weatherConditions: WeatherConditions;

  @IsString()
  @IsOptional()
  readonly comments?: string;
}

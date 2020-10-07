import { IsDateString, IsEnum, IsString, IsOptional } from 'class-validator';
import { WeatherConditions } from '../surveys.entity';

export class EditSurveyDto {
  @IsOptional()
  @IsDateString()
  readonly diveDate?: Date;

  @IsOptional()
  @IsEnum(WeatherConditions)
  readonly weatherConditions?: WeatherConditions;

  @IsOptional()
  @IsString()
  readonly comments?: string;
}

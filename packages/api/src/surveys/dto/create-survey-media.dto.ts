import {
  IsUrl,
  IsBoolean,
  IsOptional,
  IsJSON,
  IsEnum,
  IsString,
  IsInt,
  Validate,
} from 'class-validator';
import { Observations } from '../survey-media.entity';
import { ReefPointOfInterest } from '../../reef-pois/reef-pois.entity';
import { EntityExists } from '../../validations/entity-exists.constraint';

export class CreateSurveyMediaDto {
  @IsUrl()
  readonly imageUrl: string;

  @IsUrl()
  readonly thumbnailUrl: string;

  @IsInt()
  @IsOptional()
  readonly quality: number = 1;

  @IsBoolean()
  @IsOptional()
  readonly featured: boolean = false;

  @IsBoolean()
  @IsOptional()
  readonly hidden: boolean = false;

  @IsJSON()
  @IsOptional()
  readonly metadata: any = {};

  @IsEnum(Observations)
  readonly observations: Observations;

  @IsString()
  @IsOptional()
  readonly comments?: string;

  @IsInt()
  @IsOptional()
  @Validate(EntityExists, [ReefPointOfInterest])
  readonly poiId: ReefPointOfInterest;
}

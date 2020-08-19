import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Validate,
  IsInt,
  IsUrl,
} from 'class-validator';
import { EntityExists } from '../../validations/entity-exists.constraint';
import { Reef } from '../../reefs/reefs.entity';

export class CreateReefPoiDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsInt()
  readonly poiLabelId?: number;

  @IsOptional()
  @IsUrl()
  readonly imageUrl?: string;

  @IsInt()
  @Validate(EntityExists, [Reef])
  readonly reef: Reef;
}

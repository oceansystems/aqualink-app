import {
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsString,
  IsInt,
  Validate,
} from 'class-validator';
import { GeoJSON } from 'geojson';
import { EntityExists } from '../../validations/entity-exists.constraint';
import { Region } from '../regions.entity';

export class CreateRegionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly name: string;

  @IsNotEmpty()
  readonly polygon: GeoJSON;

  @IsOptional()
  @IsInt()
  @Validate(EntityExists, [Region])
  readonly parent?: Region;
}

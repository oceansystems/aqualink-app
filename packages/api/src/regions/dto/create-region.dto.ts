import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Validate,
} from 'class-validator';
import { GeoJSON } from 'geojson';
import { ApiPointProperty } from '../../docs/api-properties';
import { EntityExists } from '../../validations/entity-exists.constraint';
import { Region } from '../regions.entity';

export class CreateRegionDto {
  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPointProperty()
  @IsNotEmpty()
  readonly polygon: GeoJSON;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Validate(EntityExists, [Region])
  readonly parentId?: number;
}

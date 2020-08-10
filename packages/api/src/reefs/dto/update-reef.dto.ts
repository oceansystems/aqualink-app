import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Validate,
  MaxLength,
  IsInt,
  IsUrl,
} from 'class-validator';
import { GeoJSON } from 'geojson';
import { EntityExists } from '../../validations/entity-exists.constraint';
import { Region } from '../../regions/regions.entity';
import { User } from '../../users/users.entity';
import { VideoStream } from '../video-streams.entity';

export class UpdateReefDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly polygon?: GeoJSON;

  @IsOptional()
  @IsInt()
  readonly temperatureThreshold?: number;

  @IsOptional()
  @IsInt()
  readonly depth?: number;

  @IsOptional()
  @IsInt()
  readonly status?: number;

  @IsOptional()
  @IsUrl()
  readonly videoStream?: string;

  @IsOptional()
  @IsInt()
  @Validate(EntityExists, [Region])
  readonly region?: Region;

  @IsOptional()
  @IsInt()
  @Validate(EntityExists, [User])
  readonly admin?: User;

  @IsOptional()
  @IsInt()
  @Validate(EntityExists, [VideoStream])
  readonly stream?: VideoStream;
}

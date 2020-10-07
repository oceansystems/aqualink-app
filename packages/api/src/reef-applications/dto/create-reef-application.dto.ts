import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReefApplicationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly permitRequirements?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly fundingSource?: string;

  @IsOptional()
  @IsDateString()
  readonly installationSchedule?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly installationResources?: string;
}

export class CreateReefWithApplicationDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsInt()
  depth: number;
}

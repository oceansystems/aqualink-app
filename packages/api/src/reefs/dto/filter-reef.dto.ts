import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsBooleanString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReefStatus } from '../reefs.entity';

export class FilterReefDto {
  @ApiProperty({ example: 'Duxbury Reef' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsEnum(ReefStatus)
  readonly status?: ReefStatus;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly regionId?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly adminId?: number;

  @IsOptional()
  @IsBooleanString()
  readonly hasSpotter?: string;
}

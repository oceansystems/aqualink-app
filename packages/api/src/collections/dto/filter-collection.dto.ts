import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { Reef } from '../../reefs/reefs.entity';
import { EntityExists } from '../../validations/entity-exists.constraint';

export class FilterCollectionDto {
  @ApiProperty({ example: 'La Niña heatwave 20/21' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Validate(EntityExists, [Reef])
  reefId?: number;
}

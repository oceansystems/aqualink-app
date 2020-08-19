import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer/decorators';
import { Reef } from '../../reefs/reefs.entity';

export class FilterReefPoiDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly reef?: Reef;
}

import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer/decorators';

export class FilterRegionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly parent?: number;
}

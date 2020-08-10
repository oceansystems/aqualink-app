import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer/decorators';
import { Region } from '../../regions/regions.entity';
import { User } from '../../users/users.entity';

export class FilterReefDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsInt()
  readonly status?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly region?: Region;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly admin?: User;
}

import { IsEnum, IsNotEmpty } from 'class-validator';
import { AdminLevel } from '../users.entity';

export class SetAdminLevelDto {
  @IsNotEmpty()
  @IsEnum(AdminLevel)
  level: AdminLevel;
}

import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminLevel } from '../users/users.entity';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { LevelsGuard } from './levels.guard';

export const Auth = (...levels: AdminLevel[]) => {
  return applyDecorators(
    SetMetadata('levels', levels),
    UseGuards(FirebaseAuthGuard, LevelsGuard),
  );
};

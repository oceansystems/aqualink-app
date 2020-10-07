import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminLevel } from '../users/users.entity';
import { AuthRequest } from './auth.types';

@Injectable()
export class LevelsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const levels = this.reflector.get<AdminLevel[]>(
      'levels',
      context.getHandler(),
    );
    if (!levels || !levels.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const { user } = request;
    const hasAccess = levels.findIndex((l) => l === user.adminLevel) !== -1;
    return hasAccess;
  }
}

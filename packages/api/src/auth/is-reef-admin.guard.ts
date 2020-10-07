import { CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { User, AdminLevel } from '../users/users.entity';
import { Reef } from '../reefs/reefs.entity';

export class IsReefAdminGuard implements CanActivate {
  constructor(
    @InjectRepository(Reef)
    private reefRepository: Repository<Reef>,

    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user }: { user: User } = request;
    const reefId = parseInt(request.params.reef_id, 10);

    if (user.adminLevel === AdminLevel.SuperAdmin) {
      return true;
    }

    if (!Number.isNaN(reefId) && user.adminLevel === AdminLevel.ReefManager) {
      const isReefAdmin = await this.reefRepository
        .createQueryBuilder('reef')
        .innerJoin('reef.admins', 'admins', 'admins.id = :userId', {
          userId: user.id,
        })
        .andWhere('reef.id = :reefId', { reefId })
        .getOne();

      return !!isReefAdmin;
    }

    return false;
  }
}

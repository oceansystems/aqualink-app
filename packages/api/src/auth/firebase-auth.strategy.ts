import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../users/users.entity';
import { extractAndVerifyToken } from './firebase-auth.utils';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super();
  }

  async authenticate(req: Request): Promise<void> {
    const self = this;
    const firebaseUser = await extractAndVerifyToken(req);
    if (!firebaseUser) {
      return self.fail(new UnauthorizedException(), 401);
    }
    const firebaseUid = firebaseUser.uid;
    const user = await this.usersRepository.findOne({ where: { firebaseUid } });
    if (!user) {
      return self.fail(new UnauthorizedException(), 401);
    }
    return self.success(user, firebaseUser);
  }
}

import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

function extractAuthHeaderAsBearerToken(req: any): string | undefined {
  const authHeader = req.headers.authorization;
  const match = authHeader && authHeader.match(/bearer (.*)/i);
  return match && match[1];
}

export async function extractAndVerifyToken(
  req: any,
): Promise<admin.auth.DecodedIdToken | undefined> {
  const token = extractAuthHeaderAsBearerToken(req);
  if (!token) {
    return undefined;
  }
  try {
    const firebaseUser = await admin.auth().verifyIdToken(token, true);
    return firebaseUser;
  } catch (err) {
    return undefined;
  }
}

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super();
  }

  async authenticate(req: any): Promise<void> {
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

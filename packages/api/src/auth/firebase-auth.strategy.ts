import { Strategy } from 'passport-custom';
import { ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super();
  }

  async authenticate(req: any): Promise<void> {
    const self = this;
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      return self.fail(new UnauthorizedException(), 401);
    }
    let firebaseUser: admin.auth.DecodedIdToken;
    try {
      // eslint-disable-next-line fp/no-mutation
      firebaseUser = await admin.auth().verifyIdToken(token, true);
    } catch (err) {
      return self.fail(new UnauthorizedException(err.errorInfo.message), 401);
    }
    const user = await this.usersService.findByFirebaseUid(firebaseUser.uid);
    if (!user) {
      return self.fail(new UnauthorizedException(), 401);
    }
    return self.success(user, firebaseUser);
  }
}

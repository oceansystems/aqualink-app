import * as admin from 'firebase-admin';
import { User } from '../users/users.entity';

export type AuthRequest = Request & {
  user: User;
  info: admin.auth.DecodedIdToken;
};

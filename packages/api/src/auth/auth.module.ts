import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  providers: [FirebaseAuthStrategy],
})
export class AuthModule {}

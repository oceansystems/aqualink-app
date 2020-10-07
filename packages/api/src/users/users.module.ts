import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { ReefApplication } from '../reef-applications/reef-applications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ReefApplication])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

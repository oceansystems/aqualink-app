import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRequest } from '../auth/auth.types';
import { extractAndVerifyToken } from '../auth/firebase-auth.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminLevel, User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(req: any, createUserDto: CreateUserDto): Promise<User> {
    const firebaseUser = await extractAndVerifyToken(req);
    if (!firebaseUser) {
      throw new BadRequestException('Invalid Firebase token.');
    }
    if (firebaseUser.email !== createUserDto.email) {
      throw new BadRequestException('Invalid user email.');
    }
    const firebaseUid = firebaseUser.uid;
    const uidExists = await this.findByFirebaseUid(firebaseUid);
    if (uidExists) {
      throw new BadRequestException(
        `User with firebaseUid ${firebaseUid} already exists.`,
      );
    }
    const { email } = firebaseUser;
    const priorAccount = await this.findByEmail(email);
    if (priorAccount && priorAccount.firebaseUid) {
      throw new BadRequestException(
        `Email ${email} is already connected to a different firebaseUid.`,
      );
    }
    const data = {
      ...priorAccount,
      ...createUserDto,
    };
    const user = {
      ...data,
      firebaseUid,
    };
    return this.usersRepository.save(user);
  }

  async getSelf(req: AuthRequest): Promise<User | undefined> {
    return req.user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { firebaseUid } });
  }

  async setAdminLevel(id: number, adminLevel: AdminLevel): Promise<void> {
    const result = await this.usersRepository.update(id, { adminLevel });
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }
}

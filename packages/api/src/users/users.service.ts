import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Request } from 'express';
import { AuthRequest } from '../auth/auth.types';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminLevel, User } from './users.entity';
import { ReefApplication } from '../reef-applications/reef-applications.entity';
import { Reef } from '../reefs/reefs.entity';
import { Collection } from '../collections/collections.entity';
import { extractAndVerifyToken } from '../auth/firebase-auth.utils';
import { defaultUserCollection } from '../utils/collections.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(ReefApplication)
    private reefApplicationRepository: Repository<ReefApplication>,

    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}

  async create(req: Request, createUserDto: CreateUserDto): Promise<User> {
    const firebaseUser = await extractAndVerifyToken(req);
    if (!firebaseUser) {
      throw new BadRequestException('Invalid Firebase token.');
    }
    if (
      firebaseUser.email?.toLowerCase() !== createUserDto.email.toLowerCase()
    ) {
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
    const priorAccount = await this.findByEmail(email.toLowerCase());
    if (priorAccount && priorAccount.firebaseUid) {
      throw new BadRequestException(
        `Email ${email} is already connected to a different firebaseUid.`,
      );
    }

    if (priorAccount) {
      const newUser = await this.migrateUserAssociations(priorAccount);
      // User has associations so we have to explicitly change their admin level to reef manager
      if (
        newUser.administeredReefs.length &&
        priorAccount.adminLevel !== AdminLevel.SuperAdmin
      ) {
        // eslint-disable-next-line fp/no-mutation
        priorAccount.adminLevel = AdminLevel.ReefManager;
        // eslint-disable-next-line fp/no-mutation
        priorAccount.administeredReefs = newUser.administeredReefs;
      }
    }

    const user: DeepPartial<User> = {
      ...priorAccount,
      ...createUserDto,
      adminLevel: priorAccount?.adminLevel || AdminLevel.Default,
      email: email.toLowerCase(),
      firebaseUid,
    };
    const createdUser = await this.usersRepository.save(user);

    const collection = await this.collectionRepository.findOne({
      where: { user: createdUser },
    });

    if (!collection) {
      await this.collectionRepository.save(
        defaultUserCollection(
          createdUser.id,
          priorAccount?.administeredReefs.map((reef) => reef.id),
        ),
      );
    }

    return createdUser;
  }

  async getSelf(req: AuthRequest): Promise<User> {
    return req.user;
  }

  async getAdministeredReefs(req: AuthRequest): Promise<Reef[]> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.administeredReefs', 'reefs')
      .leftJoinAndSelect('reefs.reefApplication', 'reefApplication')
      .where('users.id = :id', { id: req.user.id })
      .getOne();

    return user!.administeredReefs.map((reef) => {
      return {
        ...reef,
        reefApplication: undefined,
        applied: reef.applied,
      };
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    // Use query builder to include the firebaseUid
    return this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.firebaseUid')
      .where('email = :email', { email })
      .getOne();
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

  /**
   * Transfer the associations between the user and the reefs from the reef-application table
   */
  private async migrateUserAssociations(user: User) {
    const reefAssociations = await this.reefApplicationRepository.find({
      where: { user },
      relations: ['reef'],
    });

    const { administeredReefs: existingReefs = [] } =
      (await this.usersRepository.findOne(user.id, {
        relations: ['administeredReefs'],
      })) || {};

    const administeredReefs = reefAssociations.reduce(
      (reefs, reefAssociation) => {
        const { reef } = reefAssociation;
        const alreadyExists = reefs.some(({ id }) => reef.id === id);
        return alreadyExists ? reefs : reefs.concat(reef);
      },
      existingReefs,
    );

    const newUser = {
      id: user.id,
      administeredReefs,
    };
    return this.usersRepository.save(newUser);
  }
}

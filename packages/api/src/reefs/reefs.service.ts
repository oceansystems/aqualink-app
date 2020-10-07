import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reef } from './reefs.entity';
import { DailyData } from './daily-data.entity';
import { CreateReefDto } from './dto/create-reef.dto';
import { FilterReefDto } from './dto/filter-reef.dto';
import { UpdateReefDto } from './dto/update-reef.dto';
import { getLiveData } from '../utils/liveData';
import { SofarLiveData } from '../utils/sofar.types';
import { getWeeklyAlertLevel, getMaxAlert } from '../workers/dailyData';

@Injectable()
export class ReefsService {
  constructor(
    @InjectRepository(Reef)
    private reefsRepository: Repository<Reef>,

    @InjectRepository(DailyData)
    private dailyDataRepository: Repository<DailyData>,
  ) {}

  latestDailyDataSubquery(): string {
    const query = this.dailyDataRepository.createQueryBuilder('dailyData');
    query.select('MAX(date)', 'date');
    query.addSelect('reef_id');
    query.groupBy('reef_id');
    return query.getQuery();
  }

  async create(createReefDto: CreateReefDto): Promise<Reef> {
    return this.reefsRepository.save(createReefDto);
  }

  async find(filter: FilterReefDto): Promise<Reef[]> {
    const query = this.reefsRepository.createQueryBuilder('reef');
    if (filter.name) {
      query.andWhere('(lower(reef.name) LIKE :name)', {
        name: `%${filter.name.toLowerCase()}%`,
      });
    }
    if (filter.status) {
      query.andWhere('reef.status = :status', { status: filter.status });
    }
    if (filter.region) {
      query.andWhere('reef.region = :region', {
        region: filter.region,
      });
    }
    if (filter.admin) {
      query.innerJoin(
        'reef.admins',
        'adminsAssociation',
        'adminsAssociation.id = :adminId',
        { adminId: filter.admin },
      );
    }
    query.leftJoinAndSelect('reef.region', 'region');
    query.leftJoinAndSelect('reef.admins', 'admins');
    query.leftJoinAndSelect('reef.stream', 'stream');
    query.leftJoinAndSelect(
      'reef.latestDailyData',
      'latestDailyData',
      `(latestDailyData.date, latestDailyData.reef_id) IN (${this.latestDailyDataSubquery()})`,
    );
    query.andWhere('approved = true');
    return query.getMany();
  }

  async findOne(id: number): Promise<Reef> {
    const found = await this.reefsRepository.findOne(id, {
      relations: ['region', 'admins', 'stream'],
    });
    if (!found) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }
    return found;
  }

  async update(id: number, updateReefDto: UpdateReefDto): Promise<Reef> {
    const result = await this.reefsRepository.update(id, updateReefDto);
    if (!result.affected) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }
    const updated = await this.reefsRepository.findOne(id);
    if (!updated) {
      throw new InternalServerErrorException('Something went wrong.');
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    const result = await this.reefsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }
  }

  async findDailyData(id: number): Promise<DailyData[]> {
    const reef = await this.reefsRepository.findOne(id);

    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }

    return this.dailyDataRepository.find({
      where: { reef: id },
      order: {
        date: 'DESC',
      },
      take: 90,
    });
  }

  async findLiveData(id: number): Promise<SofarLiveData> {
    const reef = await this.reefsRepository.findOne(id);

    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }

    const weeklyAlertLevel = await getWeeklyAlertLevel(
      this.dailyDataRepository,
      new Date(),
      reef,
    );

    const liveData = await getLiveData(reef);

    return {
      ...liveData,
      weeklyAlertLevel: getMaxAlert(liveData.dailyAlertLevel, weeklyAlertLevel),
    };
  }
}

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReefPointOfInterest } from './reef-pois.entity';
import { CreateReefPoiDto } from './dto/create-reef-poi.dto';
import { FilterReefPoiDto } from './dto/filter-reef-poi.dto';
import { UpdateReefPoiDto } from './dto/update-reef-poi.dto';

@Injectable()
export class ReefPoisService {
  constructor(
    @InjectRepository(ReefPointOfInterest)
    private poisRepository: Repository<ReefPointOfInterest>,
  ) {}

  async create(
    createReefPoiDto: CreateReefPoiDto,
  ): Promise<ReefPointOfInterest> {
    return this.poisRepository.save(createReefPoiDto);
  }

  async find(filter: FilterReefPoiDto): Promise<ReefPointOfInterest[]> {
    const query = this.poisRepository.createQueryBuilder('poi');
    if (filter.name) {
      query.andWhere('(lower(poi.name) LIKE :name)', {
        name: `%${filter.name.toLowerCase()}%`,
      });
    }
    if (filter.reef) {
      query.andWhere('poi.reef = :reef', {
        reef: filter.reef,
      });
    }
    query.leftJoinAndSelect('poi.reef', 'reef');
    return query.getMany();
  }

  async findOne(id: number): Promise<ReefPointOfInterest> {
    const found = await this.poisRepository.findOne(id, {
      relations: ['reef'],
    });
    if (!found) {
      throw new NotFoundException(
        `Reef Point of Interest with ID ${id} not found.`,
      );
    }
    return found;
  }

  async update(
    id: number,
    updateReefPoiDto: UpdateReefPoiDto,
  ): Promise<ReefPointOfInterest> {
    const result = await this.poisRepository.update(id, updateReefPoiDto);
    if (!result.affected) {
      throw new NotFoundException(
        `Reef Point of Interest with ID ${id} not found.`,
      );
    }
    const updated = await this.poisRepository.findOne(id);
    if (!updated) {
      throw new InternalServerErrorException('Something went wrong.');
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    const result = await this.poisRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(
        `Reef Point of Interest with ID ${id} not found.`,
      );
    }
  }
}

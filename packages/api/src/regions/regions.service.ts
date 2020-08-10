import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './regions.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { FilterRegionDto } from './dto/filter-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionsRepository: Repository<Region>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    return this.regionsRepository.save(createRegionDto);
  }

  async find(filter: FilterRegionDto): Promise<Region[]> {
    const query = this.regionsRepository.createQueryBuilder('region');
    if (filter.name) {
      query.andWhere('(lower(region.name) LIKE :name)', {
        name: `%${filter.name.toLowerCase()}%`,
      });
    }
    if (filter.parent) {
      query.andWhere('region.parent = :parent', {
        parent: filter.parent,
      });
    }
    query.leftJoinAndSelect('region.parent', 'parent');
    return query.getMany();
  }

  async findOne(id: number): Promise<Region> {
    const found = await this.regionsRepository.findOne(id, {
      relations: ['parent'],
    });
    if (!found) {
      throw new NotFoundException(`Region with ID ${id} not found.`);
    }
    return found;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const result = await this.regionsRepository.update(id, updateRegionDto);
    if (!result.affected) {
      throw new NotFoundException(`Region with ID ${id} not found.`);
    }
    const updated = await this.regionsRepository.findOne(id);
    if (!updated) {
      throw new InternalServerErrorException('Something went wrong.');
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    const result = await this.regionsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Region with ID ${id} not found.`);
    }
  }
}

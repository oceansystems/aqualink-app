import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoJSON } from 'geojson';
import { omit } from 'lodash';
import { ReefPointOfInterest } from './reef-pois.entity';
import { CreateReefPoiDto } from './dto/create-reef-poi.dto';
import { FilterReefPoiDto } from './dto/filter-reef-poi.dto';
import { UpdateReefPoiDto } from './dto/update-reef-poi.dto';
import { createPoint } from '../utils/coordinates';

@Injectable()
export class ReefPoisService {
  constructor(
    @InjectRepository(ReefPointOfInterest)
    private poisRepository: Repository<ReefPointOfInterest>,
  ) {}

  async create(
    createReefPoiDto: CreateReefPoiDto,
  ): Promise<ReefPointOfInterest> {
    const { latitude, longitude, reefId } = createReefPoiDto;

    const polygon: GeoJSON | undefined =
      longitude !== undefined && latitude !== undefined
        ? createPoint(longitude, latitude)
        : undefined;

    return this.poisRepository.save({
      ...createReefPoiDto,
      reef: { id: reefId },
      polygon,
    });
  }

  async find(filter: FilterReefPoiDto): Promise<ReefPointOfInterest[]> {
    const query = this.poisRepository.createQueryBuilder('poi');
    if (filter.name) {
      query.andWhere('(lower(poi.name) LIKE :name)', {
        name: `%${filter.name.toLowerCase()}%`,
      });
    }
    if (filter.reefId) {
      query.andWhere('poi.reef_id = :reef', {
        reef: filter.reefId,
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
    const { latitude, longitude, reefId } = updateReefPoiDto;
    const polygon: { polygon: GeoJSON } | {} =
      longitude !== undefined && latitude !== undefined
        ? {
            polygon: createPoint(longitude, latitude),
          }
        : {};
    const updateReef = reefId !== undefined ? { reef: { id: reefId } } : {};

    const result = await this.poisRepository.update(id, {
      ...omit(updateReefPoiDto, 'longitude', 'latitude', 'reefId'),
      ...updateReef,
      ...polygon,
    });

    if (!result.affected) {
      throw new NotFoundException(
        `Reef Point of Interest with ID ${id} not found.`,
      );
    }

    const updated = await this.poisRepository.findOne(id);

    return updated!;
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

import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUndefined, omitBy } from 'lodash';
import { Repository, MoreThan, In } from 'typeorm';
import { Collection, DynamicCollection } from './collections.entity';
import { Sources } from '../reefs/sources.entity';
import { LatestData } from '../time-series/latest-data.entity';
import { User } from '../users/users.entity';
import { hasHoboDataSubQuery } from '../utils/reef.utils';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { FilterCollectionDto } from './dto/filter-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import {
  getCollectionData,
  heatStressTracker,
} from '../utils/collections.utils';
import { Metric } from '../time-series/metrics.entity';
import { Reef } from '../reefs/reefs.entity';

@Injectable()
export class CollectionsService {
  private logger: Logger = new Logger(CollectionsService.name);

  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,

    @InjectRepository(LatestData)
    private latestDataRepository: Repository<LatestData>,

    @InjectRepository(Reef)
    private reefRepository: Repository<Reef>,

    @InjectRepository(Sources)
    private sourcesRepository: Repository<Sources>,
  ) {}

  create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const { name, isPublic, reefIds, userId } = createCollectionDto;

    const reefs = reefIds.map((reefId) => ({ id: reefId }));
    return this.collectionRepository.save({
      name,
      isPublic,
      reefs,
      user: { id: userId },
    });
  }

  find(
    filterCollectionDto: FilterCollectionDto,
    user?: User,
  ): Promise<Collection[]> {
    const { name, reefId } = filterCollectionDto;

    const query = this.collectionRepository.createQueryBuilder('collection');

    if (user) {
      query.andWhere('collection.user_id = :userId', { userId: user.id });
    } else {
      query.andWhere('collection.is_public = TRUE');
    }

    if (name) {
      query.andWhere('collection.name = :name', { name });
    }

    if (reefId) {
      query
        .innerJoin('collection.reefs', 'reef')
        .andWhere('reef.id = :reefId', { reefId });
    }

    return query.getMany();
  }

  async findOne(
    collectionId: number,
    publicOnly: boolean = false,
  ): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
      relations: [
        'reefs',
        'reefs.historicalMonthlyMean',
        'reefs.region',
        'user',
      ],
    });

    if (!collection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found.`,
      );
    }

    if (publicOnly && !collection.isPublic) {
      throw new ForbiddenException(
        `You are not allowed to access this collection with ${collectionId}`,
      );
    }

    if (collection.reefs.length === 0) {
      return collection;
    }

    return this.processCollection(collection, collection.reefs);
  }

  async update(collectionId: number, updateCollectionDto: UpdateCollectionDto) {
    const collection = await this.collectionRepository.findOne(collectionId);

    if (!collection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found.`,
      );
    }

    const {
      name,
      isPublic,
      userId,
      addReefIds,
      removeReefIds,
    } = updateCollectionDto;

    const filteredAddReefIds = addReefIds?.filter(
      (reefId) => !collection.reefIds.includes(reefId),
    );

    await this.collectionRepository
      .createQueryBuilder('collection')
      .relation('reefs')
      .of(collection)
      .addAndRemove(filteredAddReefIds || [], removeReefIds || []);

    await this.collectionRepository.update(
      {
        id: collectionId,
      },
      {
        ...omitBy({ name, isPublic }, isUndefined),
        ...(userId !== undefined ? { user: { id: userId } } : {}),
      },
    );

    return this.collectionRepository.findOne(collection.id);
  }

  async delete(collectionId: number) {
    const result = await this.collectionRepository.delete(collectionId);

    if (!result.affected) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found.`,
      );
    }
  }

  async getHeatStressTracker() {
    const heatStressData = await this.latestDataRepository.find({
      metric: Metric.DHW,
      value: MoreThan(0),
    });

    const heatStressReefIds = heatStressData.map((data) => data.reefId);

    const heatStressReefs = await this.reefRepository.find({
      where: { id: In(heatStressReefIds), approved: true },
    });

    return this.processCollection(heatStressTracker, heatStressReefs);
  }

  private async processCollection<T extends DynamicCollection | Collection>(
    collection: T,
    reefs: Reef[],
  ): Promise<T> {
    const mappedReefData = await getCollectionData(
      reefs,
      this.latestDataRepository,
    );

    const hasHoboData = await hasHoboDataSubQuery(this.sourcesRepository);

    return {
      ...collection,
      user:
        collection instanceof Collection
          ? {
              ...collection.user,
              firebaseUid: undefined,
            }
          : undefined,
      reefIds: reefs.map((reef) => reef.id),
      reefs: reefs.map((reef) => ({
        ...reef,
        hasHobo: hasHoboData.has(reef.id),
        applied: reef.applied,
        collectionData: mappedReefData[reef.id],
      })),
    };
  }
}

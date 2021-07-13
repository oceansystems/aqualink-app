import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { omit } from 'lodash';
import moment from 'moment';
import { Reef, ReefStatus } from './reefs.entity';
import { DailyData } from './daily-data.entity';
import { FilterReefDto } from './dto/filter-reef.dto';
import { UpdateReefDto } from './dto/update-reef.dto';
import { getSstAnomaly, getLiveData } from '../utils/liveData';
import { SofarLiveData } from '../utils/sofar.types';
import { getWeeklyAlertLevel, getMaxAlert } from '../workers/dailyData';
import { AdminLevel, User } from '../users/users.entity';
import { CreateReefDto, CreateReefApplicationDto } from './dto/create-reef.dto';
import { HistoricalMonthlyMean } from './historical-monthly-mean.entity';
import { Region } from '../regions/regions.entity';
import {
  getRegion,
  getTimezones,
  handleDuplicateReef,
  filterSpotterDataByDate,
  getConflictingExclusionDates,
  hasHoboDataSubQuery,
  getSSTFromLiveOrLatestData,
} from '../utils/reef.utils';
import { getMMM, getHistoricalMonthlyMeans } from '../utils/temperature';
import { getSpotterData } from '../utils/sofar';
import { ExclusionDates } from './exclusion-dates.entity';
import { DeploySpotterDto } from './dto/deploy-spotter.dto';
import { ExcludeSpotterDatesDto } from './dto/exclude-spotter-dates.dto';
import { backfillReefData } from '../workers/backfill-reef-data';
import { ReefApplication } from '../reef-applications/reef-applications.entity';
import { createPoint } from '../utils/coordinates';
import { Sources } from './sources.entity';
import { getCollectionData } from '../utils/collections.utils';
import { LatestData } from '../time-series/latest-data.entity';

@Injectable()
export class ReefsService {
  private readonly logger = new Logger(ReefsService.name);
  constructor(
    @InjectRepository(Reef)
    private reefsRepository: Repository<Reef>,

    @InjectRepository(ReefApplication)
    private reefApplicationRepository: Repository<ReefApplication>,

    @InjectRepository(DailyData)
    private dailyDataRepository: Repository<DailyData>,

    @InjectRepository(Region)
    private regionRepository: Repository<Region>,

    @InjectRepository(ExclusionDates)
    private exclusionDatesRepository: Repository<ExclusionDates>,

    @InjectRepository(HistoricalMonthlyMean)
    private historicalMonthlyMeanRepository: Repository<HistoricalMonthlyMean>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Sources)
    private sourceRepository: Repository<Sources>,

    @InjectRepository(LatestData)
    private latestDataRepository: Repository<LatestData>,
  ) {}

  async create(
    appParams: CreateReefApplicationDto,
    reefParams: CreateReefDto,
    user: User,
  ): Promise<ReefApplication> {
    const { name, latitude, longitude, depth } = reefParams;
    const region = await getRegion(longitude, latitude, this.regionRepository);
    const maxMonthlyMean = await getMMM(longitude, latitude);
    const historicalMonthlyMeans = await getHistoricalMonthlyMeans(
      longitude,
      latitude,
    );

    const timezones = getTimezones(latitude, longitude) as string[];

    const reef = await this.reefsRepository
      .save({
        name,
        region,
        polygon: createPoint(longitude, latitude),
        maxMonthlyMean,
        timezone: timezones[0],
        approved: false,
        depth,
      })
      .catch(handleDuplicateReef);

    // Elevate user to ReefManager
    if (user.adminLevel === AdminLevel.Default) {
      await this.userRepository.update(user.id, {
        adminLevel: AdminLevel.ReefManager,
      });
    }

    await this.userRepository
      .createQueryBuilder('users')
      .relation('administeredReefs')
      .of(user)
      .add(reef);

    if (!maxMonthlyMean) {
      this.logger.warn(
        `Max Monthly Mean appears to be null for Reef ${reef.id} at (lat, lon): (${latitude}, ${longitude}) `,
      );
    }

    backfillReefData(reef.id);

    await Promise.all(
      historicalMonthlyMeans.map(async ({ month, temperature }) => {
        return (
          temperature &&
          this.historicalMonthlyMeanRepository.insert({
            reef,
            month,
            temperature,
          })
        );
      }),
    );

    return this.reefApplicationRepository.save({
      ...appParams,
      reef,
      user,
    });
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

    if (filter.regionId) {
      query.andWhere('reef.region = :region', {
        region: filter.regionId,
      });
    }

    if (filter.adminId) {
      query.innerJoin(
        'reef.admins',
        'adminsAssociation',
        'adminsAssociation.id = :adminId',
        { adminId: filter.adminId },
      );
    }

    if (filter.hasSpotter) {
      const hasSpotter = filter.hasSpotter.toLowerCase() === 'true';
      query.andWhere(
        hasSpotter ? 'reef.sensor_id IS NOT NULL' : 'reef.sensor_id IS NULL',
      );
    }

    const res = await query
      .leftJoinAndSelect('reef.region', 'region')
      .leftJoinAndSelect('reef.admins', 'admins')
      .leftJoinAndSelect('reef.stream', 'stream')
      .andWhere('approved = true')
      .getMany();

    const mappedReefData = await getCollectionData(
      res,
      this.latestDataRepository,
    );

    const hasHoboDataSet = await hasHoboDataSubQuery(this.sourceRepository);

    return res.map((reef) => ({
      ...reef,
      applied: reef.applied,
      collectionData: mappedReefData[reef.id],
      hasHobo: hasHoboDataSet.has(reef.id),
    }));
  }

  async findOne(id: number): Promise<Reef> {
    const found = await this.reefsRepository.findOne(id, {
      relations: ['region', 'admins', 'stream', 'historicalMonthlyMean'],
    });

    if (!found) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }

    return found;
  }

  async update(id: number, updateReefDto: UpdateReefDto): Promise<Reef> {
    const { coordinates, adminIds, regionId, streamId } = updateReefDto;
    const updateRegion =
      regionId !== undefined ? { region: { id: regionId } } : {};
    const updateStream =
      streamId !== undefined ? { region: { id: streamId } } : {};
    const updateCoordinates = coordinates
      ? {
          polygon: createPoint(coordinates.longitude, coordinates.latitude),
        }
      : {};

    const result = await this.reefsRepository
      .update(id, {
        ...omit(updateReefDto, [
          'adminIds',
          'coordinates',
          'regionId',
          'streamId',
        ]),
        ...updateRegion,
        ...updateStream,
        ...updateCoordinates,
      })
      .catch(handleDuplicateReef);

    if (adminIds) {
      await this.updateAdmins(id, adminIds);
    }

    if (!result.affected) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }

    const updated = await this.reefsRepository.findOne(id, {
      relations: ['admins'],
    });

    return updated!;
  }

  async delete(id: number): Promise<void> {
    const result = await this.reefsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }
  }

  async findDailyData(
    id: number,
    start?: string,
    end?: string,
  ): Promise<DailyData[]> {
    const reef = await this.reefsRepository.findOne(id);

    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }

    if (!moment(start).isValid() || !moment(end).isValid()) {
      throw new BadRequestException('Start or end is not a valid date');
    }

    return this.dailyDataRepository
      .createQueryBuilder('daily_data')
      .where('reef_id = :id', { id })
      .orderBy('date', 'DESC')
      .andWhere('date <= :endDate', {
        endDate: (end && new Date(end)) || new Date(),
      })
      .andWhere('date >= :startDate', {
        startDate: new Date(start || 0),
      })
      .limit(start && end ? undefined : 90)
      .getMany();
  }

  async findLiveData(id: number): Promise<SofarLiveData> {
    const reef = await this.reefsRepository.findOne(id, {
      relations: ['historicalMonthlyMean'],
    });

    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }

    const now = new Date();

    const weeklyAlertLevel = await getWeeklyAlertLevel(
      this.dailyDataRepository,
      now,
      reef,
    );

    const isDeployed = reef.status === ReefStatus.Deployed;

    const liveData = await getLiveData(reef, isDeployed);

    const sst = await getSSTFromLiveOrLatestData(
      liveData,
      reef,
      this.latestDataRepository,
    );

    return {
      ...liveData,
      sstAnomaly: getSstAnomaly(reef.historicalMonthlyMean, sst),
      satelliteTemperature: sst,
      weeklyAlertLevel: getMaxAlert(liveData.dailyAlertLevel, weeklyAlertLevel),
    };
  }

  async getSpotterData(id: number, startDate: Date, endDate: Date) {
    const reef = await this.reefsRepository.findOne(id);

    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }

    if (!reef.sensorId) {
      throw new NotFoundException(`Reef with ${id} has no spotter.`);
    }

    const exclusionDates = await getConflictingExclusionDates(
      this.exclusionDatesRepository,
      reef.sensorId,
      startDate,
      endDate,
    );

    const { topTemperature, bottomTemperature } = await getSpotterData(
      reef.sensorId,
      endDate,
      startDate,
    );

    return {
      topTemperature: filterSpotterDataByDate(topTemperature, exclusionDates),
      bottomTemperature: filterSpotterDataByDate(
        bottomTemperature,
        exclusionDates,
      ),
    };
  }

  async deploySpotter(id: number, deploySpotterDto: DeploySpotterDto) {
    const { endDate } = deploySpotterDto;

    const reef = await this.reefsRepository.findOne(id);

    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found`);
    }

    if (!reef.sensorId) {
      throw new BadRequestException(`Reef with ID ${id} has no spotter`);
    }

    if (reef.status === ReefStatus.Deployed) {
      throw new BadRequestException(`Reef with ID ${id} is already deployed`);
    }

    // Run update queries concurrently
    await Promise.all([
      this.reefsRepository.update(id, {
        status: ReefStatus.Deployed,
      }),
      this.exclusionDatesRepository.save({
        sensorId: reef.sensorId,
        endDate,
      }),
    ]);
  }

  async addExclusionDates(
    id: number,
    excludeSpotterDatesDto: ExcludeSpotterDatesDto,
  ) {
    const { startDate, endDate } = excludeSpotterDatesDto;

    const reef = await this.reefsRepository.findOne(id);

    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found`);
    }

    if (!reef.sensorId) {
      throw new BadRequestException(`Reef with ID ${id} has no spotter`);
    }

    if (startDate >= endDate) {
      throw new BadRequestException(
        'Start date should be less than the end date',
      );
    }

    await this.exclusionDatesRepository.save({
      sensorId: reef.sensorId,
      endDate,
      startDate,
    });
  }

  async getExclusionDates(id: number) {
    const reef = await this.reefsRepository.findOne(id);

    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found`);
    }

    if (!reef.sensorId) {
      throw new BadRequestException(`Reef with ID ${id} has no spotter`);
    }

    return this.exclusionDatesRepository.find({
      where: {
        sensorId: reef.sensorId,
      },
    });
  }

  private async updateAdmins(id: number, adminIds: number[]) {
    const reef = await this.reefsRepository.findOne(id, {
      relations: ['admins'],
    });
    if (!reef) {
      throw new NotFoundException(`Reef with ID ${id} not found.`);
    }

    await this.reefsRepository
      .createQueryBuilder('reefs')
      .update()
      .relation('admins')
      .of(reef)
      .addAndRemove(adminIds, reef.admins);
  }
}

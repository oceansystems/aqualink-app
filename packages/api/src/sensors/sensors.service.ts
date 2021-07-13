import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Bluebird from 'bluebird';
import { groupBy, keyBy, mapValues } from 'lodash';
import { GeoJSON, Point } from 'geojson';
import { IsNull, Not, Repository } from 'typeorm';
import { Reef, SensorType } from '../reefs/reefs.entity';
import { Survey } from '../surveys/surveys.entity';
import { Metric } from '../time-series/metrics.entity';
import { TimeSeries } from '../time-series/time-series.entity';
import { getReefFromSensorId } from '../utils/reef.utils';
import { getSpotterData, getLatestData } from '../utils/sofar';
import { createPoint } from '../utils/coordinates';
import { SpotterData } from '../utils/sofar.types';
import {
  TimeSeriesData,
  getDataQuery,
  groupByMetricAndSource,
} from '../utils/time-series.utils';
import { DailyData } from '../reefs/daily-data.entity';
import { Sources } from '../reefs/sources.entity';
import { SensorDataDto } from './dto/sensor-data.dto';
import { SourceType } from '../reefs/schemas/source-type.enum';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(DailyData)
    private dailyDataRepository: Repository<DailyData>,

    @InjectRepository(Reef)
    private reefRepository: Repository<Reef>,

    @InjectRepository(Sources)
    private sourcesRepository: Repository<Sources>,

    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,

    @InjectRepository(TimeSeries)
    private timeSeriesRepository: Repository<TimeSeries>,
  ) {}

  async findSensors(): Promise<
    (Reef & { sensorPosition: GeoJSON; sensorType: SensorType })[]
  > {
    const reefs = await this.reefRepository.find({
      where: { sensorId: Not(IsNull()) },
    });

    // Get spotter data and add reef id to distinguish them
    const spotterData = await Bluebird.map(
      reefs,
      (reef) => {
        return getSpotterData(reef.sensorId!).then((data) => {
          return {
            id: reef.id,
            ...data,
          };
        });
      },
      { concurrency: 10 },
    );

    // Group spotter data by reef id for easier search
    const reefIdToSpotterData: Record<
      number,
      SpotterData & { id: number }
    > = keyBy(spotterData, (o) => o.id);

    // Construct final response
    return reefs.map((reef) => {
      const data = reefIdToSpotterData[reef.id];
      const longitude = getLatestData(data.longitude)?.value;
      const latitude = getLatestData(data.latitude)?.value;
      const reefPosition = reef.polygon as Point;

      // If no longitude or latitude is provided by the spotter fallback to the site coordinates
      return {
        ...reef,
        applied: reef.applied,
        sensorPosition: createPoint(
          longitude || reefPosition.coordinates[0],
          latitude || reefPosition.coordinates[1],
        ),
        sensorType: SensorType.SofarSpotter,
      };
    });
  }

  async findSensorData(
    sensorId: string,
    startDate: Date,
    endDate: Date,
    metrics: string[],
  ) {
    metrics.forEach((metric) => {
      if (!(Object as any).values(Metric).includes(metric)) {
        throw new BadRequestException(
          `Metrics array must be in the following format: metric1,metric2 where metric is one of ${Object.values(
            Metric,
          )}`,
        );
      }
    });

    const reef = await getReefFromSensorId(sensorId, this.reefRepository);

    const data = await getDataQuery(
      this.timeSeriesRepository,
      startDate,
      endDate,
      metrics as Metric[],
      false,
      reef.id,
    );

    return groupByMetricAndSource(data);
  }

  async findSensorSurveys(sensorId: string) {
    const reef = await getReefFromSensorId(sensorId, this.reefRepository);

    const surveyDetails = await this.surveyRepository
      .createQueryBuilder('survey')
      .innerJoinAndSelect('survey.surveyMedia', 'surveyMedia')
      .leftJoinAndSelect('surveyMedia.poi', 'pois')
      .where('survey.reef_id = :reefId', { reefId: reef.id })
      .andWhere('surveyMedia.hidden = False')
      .getMany();

    return Promise.all(
      surveyDetails.map(async (survey) => {
        const reefTimeSeries = await this.getClosestTimeSeriesData(
          survey.diveDate,
          survey.reefId,
          [Metric.BOTTOM_TEMPERATURE, Metric.TOP_TEMPERATURE],
          [SourceType.SPOTTER],
        );

        const dailyData = await this.getClosestDailyData(
          survey.diveDate,
          survey.reefId,
        );

        const surveyMedia = await Promise.all(
          survey.surveyMedia!.map(async (media) => {
            if (!media.poiId) {
              return media;
            }

            const poiTimeSeries = await this.getClosestTimeSeriesData(
              survey.diveDate,
              survey.reefId,
              [Metric.BOTTOM_TEMPERATURE, Metric.TOP_TEMPERATURE],
              [SourceType.HOBO],
              media.poiId,
            );

            return {
              ...media,
              sensorData: poiTimeSeries,
            };
          }),
        );

        return {
          ...survey,
          surveyMedia,
          sensorData: {
            ...reefTimeSeries,
            ...dailyData,
          },
        };
      }),
    );
  }

  private async getClosestDailyData(
    diveDate: Date,
    reefId: number,
  ): Promise<SensorDataDto | {}> {
    // We will use this many times in our query, so we declare it as constant
    const diff = `(daily_data.date::timestamp - '${diveDate.toISOString()}'::timestamp)`;

    // We order (ascending) the data by the date difference between the date column and diveData
    // and we grab the first one, which will be the closest one
    const dailyData = await this.dailyDataRepository
      .createQueryBuilder('daily_data')
      .where('daily_data.reef_id = :reefId', { reefId })
      .andWhere(`${diff} < INTERVAL '1 d'`)
      .andWhere(`${diff} > INTERVAL '-1 d'`)
      .orderBy(
        `(CASE WHEN ${diff} < INTERVAL '0' THEN (-${diff}) ELSE ${diff} END)`,
        'ASC',
      )
      .getOne();

    if (!dailyData) {
      return {};
    }

    // Create a SensorData object that contains the data point
    return {
      [SourceType.NOAA]: {
        [Metric.SATELLITE_TEMPERATURE]: {
          value: dailyData.satelliteTemperature,
          timestamp: dailyData.date,
        },
      },
    };
  }

  private async getClosestTimeSeriesData(
    diveDate: Date,
    reefId: number,
    metrics: Metric[],
    sourceTypes: SourceType[],
    poiId?: number,
  ) {
    const poiCondition = poiId
      ? `source.poi_id = ${poiId}`
      : 'source.poi_id IS NULL';
    // We will use this many times in our query, so we declare it as constant
    const diff = `(time_series.timestamp::timestamp - '${diveDate.toISOString()}'::timestamp)`;

    // First get all sources needed to avoid inner join later
    const sources = await this.sourcesRepository
      .createQueryBuilder('source')
      .where('source.type IN (:...sourceTypes)', { sourceTypes })
      .andWhere('source.reef_id = :reefId', { reefId })
      .andWhere(poiCondition)
      .getMany();

    if (!sources.length) {
      return {};
    }

    // Create map from source_id to source entity
    const sourceMap = keyBy(sources, (source) => source.id);

    // Grab all data at an interval of +/- 24 hours around the diveDate
    // Order (descending) those data by the absolute time distance between the data and the survey diveDate
    // This way the closest data point for each metric for each source type will be the last row
    const timeSeriesData: TimeSeriesData[] = await this.timeSeriesRepository
      .createQueryBuilder('time_series')
      .select('time_series.timestamp', 'timestamp')
      .addSelect('time_series.value', 'value')
      .addSelect('time_series.metric', 'metric')
      .addSelect('time_series.source_id', 'source')
      .where(`${diff} < INTERVAL '1 d'`)
      .andWhere(`${diff} > INTERVAL '-1 d'`)
      .andWhere('time_series.metric IN (:...metrics)', { metrics })
      .andWhere('time_series.source_id IN (:...sourceIds)', {
        sourceIds: Object.keys(sourceMap),
      })
      .orderBy(
        `time_series.source_id, metric, (CASE WHEN ${diff} < INTERVAL '0' THEN (-${diff}) ELSE ${diff} END)`,
        'DESC',
      )
      .getRawMany();

    // Group the data by source id
    const groupedData = groupBy(timeSeriesData, (o) => o.source);

    return Object.keys(groupedData).reduce<SensorDataDto>((data, key) => {
      return {
        ...data,
        // Replace source id by source using the mapped source object
        // Keep only timestamps and value from the resulting objects
        [sourceMap[key].type]: mapValues(
          // Use key by to group the data by metric and keep only the last entry, i.e. the closest one
          keyBy(groupedData[key], (grouped) => grouped.metric),
          (v) => ({ timestamp: v.timestamp, value: v.value }),
        ),
      };
    }, {});
  }
}

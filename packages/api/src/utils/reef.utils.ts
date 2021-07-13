import {
  Client,
  AddressType,
  GeocodeResult,
} from '@googlemaps/google-maps-services-js';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { isNil } from 'lodash';
import geoTz from 'geo-tz';
import { Region } from '../regions/regions.entity';
import { ExclusionDates } from '../reefs/exclusion-dates.entity';
import { SofarLiveData, SofarValue } from './sofar.types';
import { createPoint } from './coordinates';
import { Reef } from '../reefs/reefs.entity';
import { Sources } from '../reefs/sources.entity';
import { SourceType } from '../reefs/schemas/source-type.enum';
import { LatestData } from '../time-series/latest-data.entity';
import { Metric } from '../time-series/metrics.entity';

const googleMapsClient = new Client({});
const logger = new Logger('Reef Utils');

const getLocality = (results: GeocodeResult[]) => {
  const localityPreference = [
    AddressType.administrative_area_level_2,
    AddressType.administrative_area_level_1,
    AddressType.locality,
    AddressType.country,
  ];

  if (results.length === 0) {
    return undefined;
  }

  const result = localityPreference.reduce(
    (tempResult: GeocodeResult | undefined, locality) => {
      const localityResult = results.find((r) => r.types.includes(locality));
      return tempResult || localityResult;
    },
    undefined,
  );
  return result ? result.formatted_address : results[0].formatted_address;
};

export const getGoogleRegion = async (
  longitude: number,
  latitude: number,
): Promise<string | undefined> => {
  return googleMapsClient
    .reverseGeocode({
      params: {
        latlng: [latitude, longitude],
        result_type: [AddressType.country],
        key: process.env.GOOGLE_MAPS_API_KEY || '',
      },
    })
    .then((r) => {
      const { results } = r.data;
      return getLocality(results);
    })
    .catch((e) => {
      logger.error(
        e.response
          ? e.response.data.error_message
          : 'An unknown error occurred.',
        e,
      );
      return undefined;
    });
};

export const getRegion = async (
  longitude: number,
  latitude: number,
  regionRepository: Repository<Region>,
) => {
  const country = await getGoogleRegion(longitude, latitude);
  const region = await regionRepository.findOne({ where: { name: country } });

  if (region) {
    return region;
  }

  return country
    ? regionRepository.save({
        name: country,
        polygon: createPoint(longitude, latitude),
      })
    : undefined;
};

export const getTimezones = (latitude: number, longitude: number) => {
  return geoTz(latitude, longitude);
};

export const handleDuplicateReef = (err) => {
  // Unique Violation: A reef already exists at these coordinates
  if (err.code === '23505') {
    throw new BadRequestException('A reef already exists at these coordinates');
  }

  logger.error('An unexpected error occurred', err);
  throw new InternalServerErrorException('An unexpected error occurred');
};

export const getExclusionDates = async (
  exclusionDatesRepository: Repository<ExclusionDates>,
  sensorId: string | null,
) => {
  if (!sensorId) {
    return [];
  }

  return exclusionDatesRepository
    .createQueryBuilder('exclusion')
    .where('exclusion.sensor_id = :sensorId', {
      sensorId,
    })
    .getMany();
};

export const getConflictingExclusionDates = async (
  exclusionDatesRepository: Repository<ExclusionDates>,
  sensorId: string,
  start: Date,
  end: Date,
) => {
  const allDates = await getExclusionDates(exclusionDatesRepository, sensorId);

  return allDates.filter(
    (exclusionDate) =>
      start <= exclusionDate.endDate &&
      (!exclusionDate.startDate || exclusionDate.startDate <= end),
  );
};

export const filterSpotterDataByDate = (
  spotterData: SofarValue[],
  exclusionDates: ExclusionDates[],
) => {
  const data = spotterData.filter(({ timestamp }) => {
    const isExcluded = isNil(
      exclusionDates.find(({ startDate: start, endDate: end }) => {
        const dataDate = new Date(timestamp);
        return dataDate <= end && (!start || start <= dataDate);
      }),
    );
    return isExcluded;
  });
  return data;
};

export const getReefFromSensorId = async (
  sensorId: string,
  reefRepository: Repository<Reef>,
) => {
  const reef = await reefRepository.findOne({ where: { sensorId } });

  if (!reef) {
    throw new NotFoundException(`No site exists with sensor ID ${sensorId}`);
  }

  return reef;
};

export const hasHoboDataSubQuery = async (
  sourceRepository: Repository<Sources>,
): Promise<Set<number>> => {
  const hasHoboData: {
    reefId: number;
  }[] = await sourceRepository
    .createQueryBuilder('sources')
    .select('reef_id', 'reefId')
    .where(`type = '${SourceType.HOBO}'`)
    .groupBy('reef_id')
    .getRawMany();

  const hasHoboDataSet = new Set<number>();
  hasHoboData.forEach((row) => {
    hasHoboDataSet.add(row.reefId);
  });

  return hasHoboDataSet;
};

export const getSSTFromLiveOrLatestData = async (
  liveData: SofarLiveData,
  reef: Reef,
  latestDataRepository: Repository<LatestData>,
): Promise<SofarValue | undefined> => {
  if (!liveData.satelliteTemperature) {
    const sst = await latestDataRepository.findOne({
      reef,
      source: SourceType.NOAA,
      metric: Metric.SATELLITE_TEMPERATURE,
    });

    return (
      sst && {
        value: sst.value,
        timestamp: sst.timestamp.toISOString(),
      }
    );
  }

  return liveData.satelliteTemperature;
};

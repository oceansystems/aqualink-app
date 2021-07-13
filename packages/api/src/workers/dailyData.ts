/** Worker to process daily data for all reefs. */
import {
  isEmpty,
  isNil,
  isNumber,
  isUndefined,
  mapValues,
  omit,
  omitBy,
} from 'lodash';
import { Connection, In, Repository } from 'typeorm';
import { Point } from 'geojson';
import Bluebird from 'bluebird';
import moment from 'moment';
import { Reef } from '../reefs/reefs.entity';
import { DailyData } from '../reefs/daily-data.entity';
import { getMin, getMax, getAverage } from '../utils/math';
import {
  extractSofarValues,
  getLatestData,
  getSofarHindcastData,
  getSpotterData,
} from '../utils/sofar';
import { calculateDegreeHeatingDays } from '../utils/temperature';
import {
  DEFAULT_SPOTTER_DATA_VALUE,
  SofarDailyData,
  SofarValue,
} from '../utils/sofar.types';
import { SofarModels, sofarVariableIDs } from '../utils/constants';
import { calculateAlertLevel } from '../utils/bleachingAlert';
import { ExclusionDates } from '../reefs/exclusion-dates.entity';
import {
  filterSpotterDataByDate,
  getExclusionDates,
} from '../utils/reef.utils';

export async function getDegreeHeatingDays(
  latitude: number,
  longitude: number,
  endOfDate: Date,
  maxMonthlyMean: number | null,
): Promise<SofarValue | undefined> {
  try {
    // TODO - Get data for the past 84 days.
    const seaSurfaceTemperatures = [] as number[];
    return {
      value: calculateDegreeHeatingDays(seaSurfaceTemperatures, maxMonthlyMean),
      timestamp: endOfDate.toISOString(),
    };
  } catch {
    const degreeHeatingWeek = await getSofarHindcastData(
      SofarModels.NOAACoralReefWatch,
      sofarVariableIDs[SofarModels.NOAACoralReefWatch].degreeHeatingWeek,
      latitude,
      longitude,
      endOfDate,
      96,
    );

    // Check if there are any data returned
    // Grab the last one and convert it to degreeHeatingDays
    const latestDegreeHeatingWeek = getLatestData(degreeHeatingWeek);
    return (
      latestDegreeHeatingWeek && {
        value: latestDegreeHeatingWeek.value * 7,
        timestamp: latestDegreeHeatingWeek.timestamp,
      }
    );
  }
}

export async function getDailyData(
  reef: Reef,
  endOfDate: Date,
  excludedDates: ExclusionDates[],
): Promise<SofarDailyData> {
  const { polygon, sensorId, maxMonthlyMean } = reef;
  // TODO - Accept Polygon option
  const [longitude, latitude] = (polygon as Point).coordinates;

  const [
    spotterRawData,
    degreeHeatingDays,
    satelliteTemperatureData,
    significantWaveHeightsRaw,
    meanDirectionWindWavesRaw,
    peakPeriodWindWavesRaw,
    windSpeedsRaw,
    windDirectionsRaw,
  ] = await Promise.all([
    sensorId ? getSpotterData(sensorId, endOfDate) : DEFAULT_SPOTTER_DATA_VALUE,
    // Calculate Degree Heating Days
    // Calculating Degree Heating Days requires exactly 84 days of data.
    getDegreeHeatingDays(latitude, longitude, endOfDate, maxMonthlyMean),
    getSofarHindcastData(
      SofarModels.NOAACoralReefWatch,
      sofarVariableIDs[SofarModels.NOAACoralReefWatch]
        .analysedSeaSurfaceTemperature,
      latitude,
      longitude,
      endOfDate,
      96,
    ),
    getSofarHindcastData(
      SofarModels.NOAAOperationalWaveModel,
      sofarVariableIDs[SofarModels.NOAAOperationalWaveModel]
        .significantWaveHeight,
      latitude,
      longitude,
      endOfDate,
    ).then((data) => data.map(({ value }) => value)),
    getSofarHindcastData(
      SofarModels.NOAAOperationalWaveModel,
      sofarVariableIDs[SofarModels.NOAAOperationalWaveModel]
        .significantWaveHeight,
      latitude,
      longitude,
      endOfDate,
    ).then((data) => data.map(({ value }) => value)),
    getSofarHindcastData(
      SofarModels.NOAAOperationalWaveModel,
      sofarVariableIDs[SofarModels.NOAAOperationalWaveModel].peakPeriod,
      latitude,
      longitude,
      endOfDate,
    ).then((data) => data.map(({ value }) => value)),
    // Get NOAA GFS wind data
    getSofarHindcastData(
      SofarModels.GFS,
      sofarVariableIDs[SofarModels.GFS].magnitude10MeterWind,
      latitude,
      longitude,
      endOfDate,
    ).then((data) => data.map(({ value }) => value)),
    getSofarHindcastData(
      SofarModels.GFS,
      sofarVariableIDs[SofarModels.GFS].direction10MeterWind,
      latitude,
      longitude,
      endOfDate,
    ).then((data) => data.map(({ value }) => value)),
  ]);

  const spotterData = spotterRawData
    ? mapValues(spotterRawData, (v) =>
        v ? extractSofarValues(filterSpotterDataByDate(v, excludedDates)) : [],
      )
    : {
        topTemperature: [],
        bottomTemperature: [],
        significantWaveHeight: [],
        wavePeakPeriod: [],
        waveMeanDirection: [],
        windSpeed: [],
        windDirection: [],
      };

  const minBottomTemperature = getMin(spotterData.bottomTemperature);
  const maxBottomTemperature = getMax(spotterData.bottomTemperature);
  const avgBottomTemperature = getAverage(spotterData.bottomTemperature);

  const topTemperature = getAverage(spotterData.topTemperature);

  // Get satelliteTemperature
  const latestSatelliteTemperature =
    satelliteTemperatureData && getLatestData(satelliteTemperatureData);
  const satelliteTemperature =
    latestSatelliteTemperature && latestSatelliteTemperature.value;

  // Get waves data if unavailable through a spotter
  const significantWaveHeights =
    spotterData.significantWaveHeight.length > 0
      ? spotterData.significantWaveHeight
      : significantWaveHeightsRaw;

  const minWaveHeight =
    significantWaveHeights && getMin(significantWaveHeights);
  const maxWaveHeight =
    significantWaveHeights && getMax(significantWaveHeights);
  const avgWaveHeight =
    significantWaveHeights && getAverage(significantWaveHeights);

  const meanDirectionWindWaves =
    spotterData.waveMeanDirection.length > 0
      ? spotterData.waveMeanDirection
      : meanDirectionWindWavesRaw;

  const waveDirection =
    meanDirectionWindWaves && getAverage(meanDirectionWindWaves, true);

  const peakPeriodWindWaves =
    spotterData.wavePeakPeriod.length > 0
      ? spotterData.wavePeakPeriod
      : peakPeriodWindWavesRaw;

  const wavePeriod =
    peakPeriodWindWaves && getAverage(peakPeriodWindWaves, true);

  // Get wind data if unavailable through a spotter
  const windSpeeds = isEmpty(spotterData.windSpeed)
    ? windSpeedsRaw
    : spotterData.windSpeed;
  const windDirections = isEmpty(spotterData.windDirection)
    ? windDirectionsRaw
    : spotterData.windDirection;

  const minWindSpeed = windSpeeds && getMin(windSpeeds);
  const maxWindSpeed = windSpeeds && getMax(windSpeeds);
  const avgWindSpeed = windSpeeds && getAverage(windSpeeds);

  const windDirection = windDirections && getAverage(windDirections, true);

  const dailyAlertLevel = calculateAlertLevel(
    maxMonthlyMean,
    satelliteTemperature,
    degreeHeatingDays?.value,
  );

  return {
    reef: { id: reef.id },
    date: endOfDate,
    dailyAlertLevel,
    minBottomTemperature,
    maxBottomTemperature,
    avgBottomTemperature,
    topTemperature,
    satelliteTemperature,
    degreeHeatingDays: degreeHeatingDays?.value,
    minWaveHeight,
    maxWaveHeight,
    avgWaveHeight,
    waveDirection,
    wavePeriod,
    minWindSpeed,
    maxWindSpeed,
    avgWindSpeed,
    windDirection,
  };
}

function hasNoData(data: SofarDailyData) {
  return Object.values(omit(data, 'reef', 'date')).every(isUndefined);
}

export async function getWeeklyAlertLevel(
  dailyDataRepository: Repository<DailyData>,
  date: Date,
  reef: Reef,
): Promise<number | undefined> {
  const pastWeek = new Date(date);
  pastWeek.setDate(pastWeek.getDate() - 6);
  const query = await dailyDataRepository
    .createQueryBuilder('dailyData')
    .select('MAX(dailyData.dailyAlertLevel)', 'weeklyAlertLevel')
    .andWhere('dailyData.date >= :pastWeek', { pastWeek })
    .andWhere('dailyData.date <= :date', { date })
    .andWhere('dailyData.reef = :reef', { reef: reef.id })
    .getRawOne();

  return isNumber(query.weeklyAlertLevel) ? query.weeklyAlertLevel : undefined;
}

export function getMaxAlert(
  dailyAlertLevel?: number,
  weeklyAlertLevel?: number,
) {
  return getMax([weeklyAlertLevel, dailyAlertLevel].filter(isNumber));
}

/* eslint-disable no-console */
export async function getReefsDailyData(
  connection: Connection,
  endOfDate: Date,
  reefIds?: number[],
) {
  const reefRepository = connection.getRepository(Reef);
  const dailyDataRepository = connection.getRepository(DailyData);
  const exclusionDatesRepository = connection.getRepository(ExclusionDates);
  const allReefs = await reefRepository.find(
    reefIds && reefIds.length > 0
      ? {
          where: {
            id: In(reefIds),
          },
        }
      : {},
  );
  const start = new Date();
  console.log(
    `Updating ${allReefs.length} reefs for ${endOfDate.toDateString()}.`,
  );
  await Bluebird.map(
    allReefs,
    async (reef) => {
      const excludedDates = await getExclusionDates(
        exclusionDatesRepository,
        reef.sensorId,
      );

      const dailyDataInput = await getDailyData(reef, endOfDate, excludedDates);

      if (hasNoData(dailyDataInput)) {
        console.log('No data has been fetched. Skipping...');
        return;
      }

      const weeklyAlertLevel = await getWeeklyAlertLevel(
        dailyDataRepository,
        endOfDate,
        reef,
      );

      const entity = dailyDataRepository.create({
        ...dailyDataInput,
        weeklyAlertLevel: getMaxAlert(
          dailyDataInput.dailyAlertLevel,
          weeklyAlertLevel,
        ),
      });
      try {
        await dailyDataRepository.save(entity);
      } catch (err) {
        // Update instead of insert
        if (err.constraint === 'no_duplicated_date') {
          const filteredData = omitBy(entity, isNil);
          await dailyDataRepository
            .createQueryBuilder('dailyData')
            .update()
            .where('reef_id = :reef_id', { reef_id: reef.id })
            .andWhere('Date(date) = Date(:date)', { date: entity.date })
            .set(filteredData)
            .execute();
        } else {
          console.error(
            `Error updating data for Reef ${
              reef.id
            } & ${endOfDate.toDateString()}: ${err}.`,
          );
        }
      }
    },
    { concurrency: 8 },
  );
  console.log(
    `Updated ${allReefs.length} reefs in ${
      (new Date().valueOf() - start.valueOf()) / 1000
    } seconds`,
  );
}

export async function runDailyUpdate(conn: Connection) {
  const today = moment()
    .utc()
    .hours(23)
    .minutes(59)
    .seconds(59)
    .milliseconds(999);

  const yesterday = moment(today);
  yesterday.day(today.day() - 1);
  console.log(`Daily Update for data ending on ${yesterday.date()}`);
  try {
    await getReefsDailyData(conn, yesterday.toDate());
    console.log('Completed daily update.');
  } catch (error) {
    console.error(error);
  }
}

/** Worker to process daily data for all reefs. */
import { isNil, isNumber, omitBy } from 'lodash';
import { Connection, In, Repository } from 'typeorm';
import { Point } from 'geojson';
import Bluebird from 'bluebird';
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
import { SofarDailyData, SofarValue } from '../utils/sofar.types';
import { SofarModels, sofarVariableIDs } from '../utils/constants';
import { calculateAlertLevel } from '../utils/bleachingAlert';

export async function getDegreeHeatingDays(
  maxMonthlyMean: number,
  latitude: number,
  longitude: number,
  endOfDate: Date,
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
  date: Date,
): Promise<SofarDailyData> {
  const { polygon, spotterId, maxMonthlyMean } = reef;
  // TODO - Accept Polygon option
  const [longitude, latitude] = (polygon as Point).coordinates;

  // Get the end of the day for the date.
  const endOfDate = new Date(date);
  endOfDate.setUTCHours(23, 59, 59, 59);

  const [
    spotterRawData,
    degreeHeatingDays,
    satelliteTemperatureData,
    significantWaveHeightsRaw,
    meanDirectionWindWavesRaw,
    peakPeriodWindWavesRaw,
    windVelocities,
    windDirections,
  ] = await Promise.all([
    spotterId
      ? getSpotterData(spotterId, endOfDate)
      : {
          surfaceTemperature: [],
          bottomTemperature: [],
          significantWaveHeight: [],
          wavePeakPeriod: [],
          waveMeanDirection: [],
        },
    // Calculate Degree Heating Days
    // Calculating Degree Heating Days requires exactly 84 days of data.
    getDegreeHeatingDays(maxMonthlyMean, latitude, longitude, endOfDate),
    getSofarHindcastData(
      SofarModels.NOAACoralReefWatch,
      sofarVariableIDs[SofarModels.NOAACoralReefWatch]
        .analysedSeaSurfaceTemperature,
      latitude,
      longitude,
      endOfDate,
      48,
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
    ? {
        surfaceTemperature: extractSofarValues(
          spotterRawData.surfaceTemperature,
        ),
        bottomTemperature: extractSofarValues(spotterRawData.bottomTemperature),
        significantWaveHeight: extractSofarValues(
          spotterRawData.significantWaveHeight,
        ),
        wavePeakPeriod: extractSofarValues(spotterRawData.wavePeakPeriod),
        waveMeanDirection: extractSofarValues(spotterRawData.waveMeanDirection),
      }
    : {
        surfaceTemperature: [],
        bottomTemperature: [],
        significantWaveHeight: [],
        wavePeakPeriod: [],
        waveMeanDirection: [],
      };

  const minBottomTemperature = getMin(spotterData.bottomTemperature);
  const maxBottomTemperature = getMax(spotterData.bottomTemperature);
  const avgBottomTemperature = getAverage(spotterData.bottomTemperature);

  const surfaceTemperature = getAverage(spotterData.surfaceTemperature);

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

  const minWindSpeed = windVelocities && getMin(windVelocities);
  const maxWindSpeed = windVelocities && getMax(windVelocities);
  const avgWindSpeed = windVelocities && getAverage(windVelocities);

  const windDirection = windDirections && getAverage(windDirections, true);

  const dailyAlertLevel = calculateAlertLevel(
    maxMonthlyMean,
    satelliteTemperature,
    degreeHeatingDays?.value,
  );

  return {
    reef: { id: reef.id },
    date,
    dailyAlertLevel,
    minBottomTemperature,
    maxBottomTemperature,
    avgBottomTemperature,
    surfaceTemperature,
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
  date: Date,
  reefIds?: number[],
) {
  const reefRepository = connection.getRepository(Reef);
  const dailyDataRepository = connection.getRepository(DailyData);
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
  console.log(`Updating ${allReefs.length} reefs for ${date.toDateString()}.`);
  await Bluebird.map(
    allReefs,
    async (reef) => {
      const dailyDataInput = await getDailyData(reef, date);
      const weeklyAlertLevel = await getWeeklyAlertLevel(
        dailyDataRepository,
        date,
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
          return;
        }
        console.error(
          `Error updating data for Reef ${reef.id} & ${date}: ${err}.`,
        );
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
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  console.log(`Daily Update for data on ${yesterday.toDateString()}`);
  try {
    await getReefsDailyData(conn, yesterday);
    console.log('Completed daily update.');
  } catch (error) {
    console.error(error);
  }
}
/* eslint-enable no-console */

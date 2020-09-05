/** Worker to process daily data for all reefs. */
import { isNil, omitBy, sum } from 'lodash';
import { Connection } from 'typeorm';
import { Point } from 'geojson';
import Bluebird from 'bluebird';
import { Reef } from '../reefs/reefs.entity';
import { DailyData } from '../reefs/daily-data.entity';
import { getSofarDailyData, getSpotterData } from '../utils/sofar';
import { calculateDegreeHeatingDays } from '../utils/temperature';

const getAverage = (numbers: number[], round = false) => {
  const average =
    numbers.length > 0 ? sum(numbers) / numbers.length : undefined;
  return average !== undefined && round ? Math.round(average) : average;
};

const getMin = (numbers: number[]) => {
  return numbers.length > 0 ? Math.min(...numbers) : undefined;
};

const getMax = (numbers: number[]) => {
  return numbers.length > 0 ? Math.max(...numbers) : undefined;
};

export async function getDailyData(reef: Reef, date: Date) {
  const { polygon, spotterId, maxMonthlyMean, timezone: localTimezone } = reef;
  // TODO - Accept Polygon option
  const [longitude, latitude] = (polygon as Point).coordinates;

  const spotterData = spotterId
    ? await getSpotterData(spotterId, localTimezone, date)
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

  // Calculate Degree Heating Days
  // Calculating Degree Heating Days requires exactly 84 days of data.
  let degreeHeatingDays: number;
  try {
    // TODO - Get data for the past 84 days.
    const seaSurfaceTemperatures = [] as number[];
    degreeHeatingDays = calculateDegreeHeatingDays(
      seaSurfaceTemperatures,
      maxMonthlyMean,
    );
  } catch {
    const degreeHeatingWeek = await getSofarDailyData(
      'NOAACoralReefWatch',
      'degreeHeatingWeek',
      latitude,
      longitude,
      localTimezone,
      date,
    );

    degreeHeatingDays =
      degreeHeatingWeek.length > 0 ? degreeHeatingWeek[0].value * 7 : 0;
  }

  const satelliteTemperatureData = await getSofarDailyData(
    'HYCOM',
    'HYCOM-seaSurfaceTemperature',
    latitude,
    longitude,
    localTimezone,
    date,
  );

  // Get satelliteTemperature closest to midnight local time by grabbing the last datapoint.
  const satelliteTemperature =
    (satelliteTemperatureData &&
      satelliteTemperatureData.length > 0 &&
      satelliteTemperatureData.slice(-1)[0].value) ||
    undefined;

  // Get waves data if unavailable through a spotter

  const significantWaveHeights =
    spotterData.significantWaveHeight.length > 0
      ? spotterData.significantWaveHeight
      : (
          await getSofarDailyData(
            'NOAAOperationalWaveModel',
            'NOAAOperationalWaveModel-significantWaveHeight',
            latitude,
            longitude,
            localTimezone,
            date,
          )
        ).map(({ value }) => value);

  const minWaveHeight = getMin(significantWaveHeights);
  const maxWaveHeight = getMax(significantWaveHeights);
  const avgWaveHeight = getAverage(significantWaveHeights);

  const meanDirectionWindWaves =
    spotterData.waveMeanDirection.length > 0
      ? spotterData.waveMeanDirection
      : (
          await getSofarDailyData(
            'NOAAOperationalWaveModel',
            'NOAAOperationalWaveModel-meanDirectionWindWaves',
            latitude,
            longitude,
            localTimezone,
            date,
          )
        ).map(({ value }) => value);

  const waveDirection = getAverage(meanDirectionWindWaves, true);

  const peakPeriodWindWaves =
    spotterData.wavePeakPeriod.length > 0
      ? spotterData.wavePeakPeriod
      : (
          await getSofarDailyData(
            'NOAAOperationalWaveModel',
            'NOAAOperationalWaveModel-peakPeriod',
            latitude,
            longitude,
            localTimezone,
            date,
          )
        ).map(({ value }) => value);

  const wavePeriod = getAverage(peakPeriodWindWaves, true);

  // Get NOAA GFS wind data
  const windVelocities = (
    await getSofarDailyData(
      'GFS',
      'GFS-magnitude10MeterWind',
      latitude,
      longitude,
      localTimezone,
      date,
    )
  ).map(({ value }) => value);

  const minWindSpeed = getMin(windVelocities);
  const maxWindSpeed = getMax(windVelocities);
  const avgWindSpeed = getAverage(windVelocities);

  const windDirections = (
    await getSofarDailyData(
      'GFS',
      'GFS-magnitude10MeterWind',
      latitude,
      longitude,
      localTimezone,
      date,
    )
  ).map(({ value }) => value);

  const windDirection = getAverage(windDirections, true);

  return {
    reef: { id: reef.id },
    date,
    minBottomTemperature,
    maxBottomTemperature,
    avgBottomTemperature,
    surfaceTemperature,
    satelliteTemperature,
    degreeHeatingDays,
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

export async function getReefsDailyData(connection: Connection, date: Date) {
  const reefRepository = connection.getRepository(Reef);
  const dailyDataRepository = connection.getRepository(DailyData);
  const allReefs = await reefRepository.find();
  const start = new Date();
  console.log(`Updating ${allReefs.length} reefs.`);
  await Bluebird.map(
    allReefs,
    async (reef) => {
      const dailyDataInput = await getDailyData(reef, date);
      const entity = dailyDataRepository.create(dailyDataInput);
      try {
        await dailyDataRepository.save(entity);
      } catch (err) {
        // Update instead of insert
        if (err.constraint === 'no_duplicated_date') {
          const filteredData = omitBy(entity, isNil);

          await dailyDataRepository.update(
            {
              reef,
              date: entity.date,
            },
            filteredData,
          );
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

/* eslint-disable no-console */
export async function runDailyUpdate(conn: Connection) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

/** Utility function to access the Sofar API and retrieve relevant data. */
import axios from 'axios';
import { isNil } from 'lodash';
import axiosRetry from 'axios-retry';
import { getStartEndDate } from './dates';
import { SOFAR_MARINE_URL, SOFAR_SPOTTER_URL } from './constants';
import { SofarValue, SpotterData } from './sofar.types';

type SensorData = {
  sensorPosition: number;
  degrees: number;
};

export const getLatestData = (
  sofarValues: SofarValue[],
): SofarValue | undefined =>
  sofarValues.reduce(
    (max, entry) =>
      new Date(entry.timestamp) > new Date(max.timestamp) ? entry : max,
    sofarValues[0],
  );

export const extractSofarValues = (sofarValues: SofarValue[]): number[] =>
  sofarValues.filter((data) => !isNil(data.value)).map(({ value }) => value);

axiosRetry(axios, { retries: 3 });

export async function sofarHindcast(
  modelId: string,
  variableID: string,
  latitude: number,
  longitude: number,
  start: string,
  end: string,
) {
  return axios
    .get(`${SOFAR_MARINE_URL}${modelId}/hindcast/point`, {
      params: {
        variableIDs: [variableID],
        latitude,
        longitude,
        start,
        end,
        token: process.env.SOFAR_API_TOKEN,
      },
    })
    .then((response) => {
      return response.data.hindcastVariables[0];
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `Sofar Hindcast API responded with a ${error.response.status} status. ${error.response.data.message}`,
        );
      } else {
        console.error(
          `An error occurred accessing the Sofar Hindcast API - ${error}`,
        );
      }
    });
}

export async function sofarForecast(
  modelId: string,
  variableID: string,
  latitude: number,
  longitude: number,
): Promise<SofarValue> {
  return axios
    .get(`${SOFAR_MARINE_URL}${modelId}/forecast/point`, {
      params: {
        variableIDs: [variableID],
        latitude,
        longitude,
        token: process.env.SOFAR_API_TOKEN,
      },
    })
    .then((response) => {
      // Get latest live (forecast) data
      return response.data.forecastVariables[0].values[0];
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `Sofar Forecast API responded with a ${error.response.status} status. ${error.response.data.message}`,
        );
      } else {
        console.error(
          `An error occurred accessing the Sofar Forecast API - ${error}`,
        );
      }
    });
}

export async function sofarSpotter(
  spotterId: string,
  start?: string,
  end?: string,
) {
  return axios
    .get(SOFAR_SPOTTER_URL, {
      params: {
        spotterId,
        startDate: start,
        endDate: end,
        limit: start && end ? 500 : 100,
        token: process.env.SOFAR_API_TOKEN,
        includeSmartMooringData: true,
        includeSurfaceTempData: true,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `Sofar API responded with a ${error.response.status} status. ${error.response.message}`,
        );
      } else {
        console.error(`An error occured accessing the Sofar API - ${error}`);
      }
    });
}

export async function getSofarHindcastData(
  modelId: string,
  variableID: string,
  latitude: number,
  longitude: number,
  endDate: Date,
  hours?: number,
) {
  const [start, end] = getStartEndDate(endDate, hours);
  // Get data for model and return values
  const hindcastVariables = await sofarHindcast(
    modelId,
    variableID,
    latitude,
    longitude,
    start,
    end,
  );

  // Filter out unkown values
  return (hindcastVariables
    ? hindcastVariables.values.filter(
        (data: SofarValue) => !isNil(data.value) && data.value !== 9999,
      )
    : []) as SofarValue[];
}

function getDataBySensorPosition(data: SensorData[], sensorPosition: number) {
  return data.find((d) => d.sensorPosition === sensorPosition)?.degrees;
}

export async function getSpotterData(
  // eslint-disable-next-line no-unused-vars
  spotterId: string,
  // eslint-disable-next-line no-unused-vars
  endDate?: Date,
): Promise<SpotterData> {
  const [start, end] = endDate ? getStartEndDate(endDate) : [];
  const {
    data: { waves = [], smartMooringData = [] },
  } = (await sofarSpotter(spotterId, start, end)) || { data: {} };

  const [
    sofarSignificantWaveHeight,
    sofarPeakPeriod,
    sofarMeanDirection,
    spotterLatitude,
    spotterLongitude,
  ]: [
    SofarValue[],
    SofarValue[],
    SofarValue[],
    SofarValue[],
    SofarValue[],
  ] = waves.reduce(
    (
      [
        significantWaveHeights,
        peakPeriods,
        meanDirections,
        latitude,
        longitude,
      ],
      data,
    ) => {
      return [
        significantWaveHeights.concat({
          timestamp: data.timestamp,
          value: data.significantWaveHeight,
        }),
        peakPeriods.concat({
          timestamp: data.timestamp,
          value: data.peakPeriod,
        }),
        meanDirections.concat({
          timestamp: data.timestamp,
          value: data.meanDirection,
        }),
        latitude.concat({
          timestamp: data.timestamp,
          value: data.latitude,
        }),
        longitude.concat({
          timestamp: data.timestamp,
          value: data.longitude,
        }),
      ];
    },
    [[], [], [], [], []],
  );

  const [sofarBottomTemperature, sofarSurfaceTemperature]: [
    SofarValue[],
    SofarValue[],
  ] = smartMooringData.reduce(
    ([sensor0Data, sensor1Data], data) => {
      getDataBySensorPosition(data.sensorData, 0);
      return [
        sensor0Data.concat({
          timestamp: data.timestamp,
          value: getDataBySensorPosition(data.sensorData, 0),
        }),
        sensor1Data.concat({
          timestamp: data.timestamp,
          value: getDataBySensorPosition(data.sensorData, 1),
        }),
      ];
    },
    [[], []],
  );

  return {
    surfaceTemperature: sofarBottomTemperature,
    bottomTemperature: sofarSurfaceTemperature,
    significantWaveHeight: sofarSignificantWaveHeight,
    wavePeakPeriod: sofarPeakPeriod,
    waveMeanDirection: sofarMeanDirection,
    latitude: spotterLatitude,
    longitude: spotterLongitude,
  };
}

/** Utility function to get the closest available data given a date in UTC. */
export function getValueClosestToDate(
  sofarValues: SofarValue[],
  utcDate: Date,
) {
  const timeDiff = (timestamp: string) =>
    Math.abs(new Date(timestamp).getTime() - utcDate.getTime());

  return sofarValues.reduce((prevClosest, nextPoint) =>
    timeDiff(prevClosest.timestamp) > timeDiff(nextPoint.timestamp)
      ? nextPoint
      : prevClosest,
  ).value;
}

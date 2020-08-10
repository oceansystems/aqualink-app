/** Utility function to access the Sofar API and retrieve relevant data. */
import axios from 'axios';
import moment from 'moment-timezone';
import {
  SOFAR_MARINE_URL,
  // SOFAR_SPOTTER_URL,
} from './constants';

type SofarValue = {
  timestamp: string;
  value: number;
};

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
          `Sofar API responded with a ${error.response.status} status. ${error.response.message}`,
        );
      } else {
        console.error(`An error occured accessing the Sofar API - ${error}`);
      }
    });
}

export async function getSofarDailyData(
  modelId: string,
  variableID: string,
  latitude: number,
  longitude: number,
  localTimezone: string,
  date: Date,
) {
  // Get day equivalent in timezone using geo-tz to compute "start" and "end".
  // We fetch daily data from midnight to midnight LOCAL time.
  const m = moment.tz(date, localTimezone);
  const start = m.clone().startOf('day').utc().format();
  const end = m.clone().endOf('day').utc().format();
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
        (data: SofarValue) => data.value && data.value !== 9999,
      )
    : []) as SofarValue[];
}

type SpotterData = {
  surfaceTemperature: number;
  bottomTemperature: number[];
};

export async function getSpotterData(
  // eslint-disable-next-line no-unused-vars
  spotterId: string,
  // eslint-disable-next-line no-unused-vars
  date: Date,
): Promise<SpotterData> {
  // TODO - Implement Spotter Data Retrieval
  // https://docs.sofarocean.com/spotter-sensor
  // getSofarSpotterData()
  // using SOFAR_SPOTTER_URL
  return { surfaceTemperature: 20, bottomTemperature: [0] };
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

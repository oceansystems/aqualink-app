import { isNil } from "lodash";

import type { TableRow } from "../Homepage/types";
import type {
  Metrics,
  MetricsKeys,
  OceanSenseData,
  OceanSenseDataResponse,
  OceanSenseKeys,
  Reef,
  SofarValue,
  TimeSeriesData,
  TimeSeriesDataRange,
  TimeSeriesDataRangeResponse,
  TimeSeriesDataResponse,
} from "./types";

export function getReefNameAndRegion(reef: Reef) {
  const name = reef.name || reef.region?.name || null;
  const region = reef.name ? reef.region?.name : null;
  return { name, region };
}

export const longDHW = (dhw: number | null): string =>
  `0000${dhw ? Math.round(dhw * 10) : "0"}`.slice(-4);

export const constructTableData = (list: Reef[]): TableRow[] => {
  return list.map((value, key) => {
    const {
      dhw,
      satelliteTemperature,
      weeklyAlert,
      bottomTemperature,
      topTemperature,
      sstAnomaly,
    } = value.collectionData || {};

    const { maxMonthlyMean } = value;
    const { name: locationName = "", region = "" } = getReefNameAndRegion(
      value
    );

    return {
      locationName,
      sst: isNil(satelliteTemperature) ? null : satelliteTemperature,
      historicMax: maxMonthlyMean,
      sstAnomaly: isNil(sstAnomaly) ? null : sstAnomaly,
      buoyTop: isNil(topTemperature) ? null : topTemperature,
      buoyBottom: isNil(bottomTemperature) ? null : bottomTemperature,
      maxMonthlyMean,
      depth: value.depth,
      dhw: isNil(dhw) ? null : dhw,
      region,
      tableData: {
        id: key,
      },
      alert: `${weeklyAlert || 0},${longDHW(isNil(dhw) ? null : dhw)}`,
      alertLevel: isNil(weeklyAlert) ? null : weeklyAlert,
    };
  });
};

const mapMetrics = <T>(
  data: Record<MetricsKeys, T[]>
): Record<Metrics, T[]> => ({
  alert: data.alert,
  bottomTemperature: data.bottom_temperature,
  dhw: data.dhw,
  satelliteTemperature: data.satellite_temperature,
  sstAnomaly: data.sst_anomaly,
  topTemperature: data.top_temperature,
  significantWaveHeight: data.significant_wave_height,
  waveMeanDirection: data.wave_mean_direction,
  wavePeakPeriod: data.wave_peak_period,
  windDirection: data.wind_direction,
  windSpeed: data.wind_speed,
  weeklyAlert: data.weekly_alert,
});

export const mapTimeSeriesData = (
  timeSeriesData: TimeSeriesDataResponse
): TimeSeriesData => ({
  hobo: mapMetrics(timeSeriesData.hobo),
  spotter: mapMetrics(timeSeriesData.spotter),
  sofarNoaa: mapMetrics(timeSeriesData.noaa),
  sofarGfs: mapMetrics(timeSeriesData.gfs),
});

export const mapTimeSeriesDataRanges = (
  ranges: TimeSeriesDataRangeResponse
): TimeSeriesDataRange => ({
  hobo: mapMetrics(ranges.hobo),
  spotter: mapMetrics(ranges.spotter),
  sofarNoaa: mapMetrics(ranges.noaa),
  sofarGfs: mapMetrics(ranges.gfs),
});

const mapOceanSenseMetric = (
  response: OceanSenseDataResponse,
  key: OceanSenseKeys
): SofarValue[] =>
  response.data[key].map((value, index) => ({
    value,
    timestamp: response.timestamps[index],
  }));

export const mapOceanSenseData = (
  response: OceanSenseDataResponse
): OceanSenseData => {
  return {
    DO: mapOceanSenseMetric(response, "DO"),
    EC: mapOceanSenseMetric(response, "EC"),
    ORP: mapOceanSenseMetric(response, "ORP"),
    PH: mapOceanSenseMetric(response, "PH"),
    PRESS: mapOceanSenseMetric(response, "PRESS"),
  };
};

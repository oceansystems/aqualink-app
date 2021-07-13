import { CollectionData, CollectionDataResponse } from "../Reefs/types";
import { CollectionDetails, CollectionDetailsResponse } from "./types";

export const mapCollectionData = (
  data: CollectionDataResponse
): CollectionData => ({
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

export const constructCollection = (
  data: CollectionDetailsResponse
): CollectionDetails => ({
  ...data,
  reefs: data.reefs.map((item) => ({
    ...item,
    collectionData: mapCollectionData(item.collectionData || {}),
  })),
});

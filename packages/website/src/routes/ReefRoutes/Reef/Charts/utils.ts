import { isNil } from "lodash";
import type { Data } from "../../../../store/Reefs/types";

export const createDatasets = (dailyData: Data[]) => {
  const dailyDataLen = dailyData.length;

  const bottomTemperature = dailyData.map((item) => item.avgBottomTemperature);
  const surfaceTemperature = dailyData
    .filter((item) => item.satelliteTemperature !== null)
    .map((item) => item.satelliteTemperature);

  const meanBottomTemperature =
    bottomTemperature.reduce((a, b) => a + b) / dailyDataLen;
  const meanSurfaceTemperature =
    surfaceTemperature.reduce((a, b) => a + b) / dailyDataLen;

  return {
    bottomTemperatureData: [
      meanBottomTemperature,
      ...bottomTemperature,
      meanBottomTemperature,
    ],
    surfaceTemperatureData: [
      meanSurfaceTemperature,
      ...surfaceTemperature,
      meanSurfaceTemperature,
    ],
  };
};

export const calculateAxisLimits = (
  dailyData: Data[],
  temperatureThreshold: number | null
) => {
  const dates = dailyData
    .filter(
      (item) =>
        item.surfaceTemperature !== null || item.satelliteTemperature !== null
    )
    .map((item) => item.date);
  const dailyDataLen = dates.length;

  const xAxisMax = new Date(
    new Date(dates[dailyDataLen - 1]).setHours(24, 0, 0, 0)
  ).toISOString();

  const xAxisMin = new Date(
    new Date(dates[0]).setHours(-1, 0, 0, 0)
  ).toISOString();

  // Add an extra date one day after the final daily data date
  const chartLabels = [
    new Date(new Date(xAxisMin).setHours(3, 0, 0, 0)).toISOString(),
    ...dates,
    new Date(new Date(xAxisMax).setHours(3, 0, 0, 0)).toISOString(),
  ];

  const { bottomTemperatureData, surfaceTemperatureData } = createDatasets(
    dailyData
  );

  const temperatureData = [
    ...bottomTemperatureData,
    ...surfaceTemperatureData,
  ].filter((value) => !isNil(value));

  const yAxisMinTemp = Math.min(...temperatureData) - 2;

  const yAxisMaxTemp = Math.max(...temperatureData) + 2;

  const yAxisMin = Math.round(
    temperatureThreshold
      ? Math.min(yAxisMinTemp, temperatureThreshold - 5)
      : Math.round(yAxisMinTemp)
  );

  const yAxisMax = Math.round(
    temperatureThreshold
      ? Math.max(yAxisMaxTemp, temperatureThreshold + 5)
      : Math.round(yAxisMaxTemp)
  );

  return {
    xAxisMax,
    xAxisMin,
    yAxisMin,
    yAxisMax,
    chartLabels,
  };
};

import type { ChartProps } from ".";
import { sortByDate } from "../../helpers/sortDailyData";
import type { DailyData } from "../../store/Reefs/types";

export const createDatasets = (dailyData: DailyData[]) => {
  const bottomTemperature = dailyData.map((item) => item.avgBottomTemperature);
  const surfaceTemperature = dailyData
    .filter((item) => item.satelliteTemperature !== null)
    .map((item) => item.satelliteTemperature);

  return {
    bottomTemperatureData: [
      bottomTemperature[0],
      ...bottomTemperature,
      bottomTemperature[bottomTemperature.length - 1],
    ],
    surfaceTemperatureData: [
      surfaceTemperature[0],
      ...surfaceTemperature,
      surfaceTemperature[surfaceTemperature.length - 1],
    ],
  };
};

export const calculateAxisLimits = (
  dailyData: DailyData[],
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

  const { surfaceTemperatureData } = createDatasets(dailyData);

  const temperatureData = [...surfaceTemperatureData].filter((value) => value);

  const yAxisMinTemp = Math.min(...temperatureData) - 2;

  const yAxisMaxTemp = Math.max(...temperatureData) + 2;

  const yAxisMin = Math.round(
    temperatureThreshold
      ? Math.min(yAxisMinTemp, temperatureThreshold - 2)
      : yAxisMinTemp
  );

  const yAxisMax = Math.round(
    temperatureThreshold
      ? Math.max(yAxisMaxTemp, temperatureThreshold + 2)
      : yAxisMaxTemp
  );

  return {
    xAxisMax,
    xAxisMin,
    yAxisMin,
    yAxisMax,
    chartLabels,
  };
};

export function useProcessedChartData(
  dailyData: ChartProps["dailyData"],
  temperatureThreshold: ChartProps["temperatureThreshold"]
) {
  // Sort daily data by date
  const sortedDailyData = sortByDate(dailyData, "date");

  const datasets = createDatasets(sortedDailyData);

  const axisLimits = calculateAxisLimits(sortedDailyData, temperatureThreshold);
  return { sortedDailyData, ...axisLimits, ...datasets };
}
import type { Data } from "../../../../store/Reefs/types";

export const createDatasets = (dailyData: Data[]) => {
  const dailyDataLen = dailyData.length;

  const bottomTemperature = dailyData.map((item) => item.avgBottomTemperature);
  const windSpeed = dailyData.map((item) => item.avgWindSpeed);
  const waveHeight = dailyData.map((item) => item.avgWaveHeight);

  const meanBottomTemperature =
    bottomTemperature.reduce((a, b) => a + b) / dailyDataLen;
  const meanWindSpeed = windSpeed.reduce((a, b) => a + b) / dailyDataLen;
  const meanWaveHeight = waveHeight.reduce((a, b) => a + b) / dailyDataLen;

  return {
    bottomTemperatureData: [...bottomTemperature, meanBottomTemperature],
    windSpeedData: [...windSpeed, meanWindSpeed],
    waveHeightData: [...waveHeight, meanWaveHeight],
  };
};

export const calculateAxisLimits = (dailyData: Data[]) => {
  const dates = dailyData.map((item) => item.date);
  const dailyDataLen = dailyData.length;

  const xAxisMax = new Date(
    new Date(dates[dailyDataLen - 1]).setHours(24, 0, 0, 0)
  ).toISOString();

  const xAxisMin = new Date(
    new Date(xAxisMax).setHours(-7 * 24, 0, 0, 0)
  ).toISOString();

  // Add an extra date one day after the final daily data date
  const chartLabels = [
    ...dates,
    new Date(new Date(xAxisMax).setHours(3, 0, 0, 0)).toISOString(),
  ];

  return {
    xAxisMax,
    xAxisMin,
    chartLabels,
  };
};

import type { ChartPoint } from "chart.js";
import { ChartComponentProps } from "react-chartjs-2";
import type { ChartProps } from ".";
import { sortByDate } from "../../helpers/sortDailyData";
import type { DailyData, SofarValue } from "../../store/Reefs/types";
import { SurveyListItem } from "../../store/Survey/types";

// TODO make bottom temp permanent once we work UI caveats
export const CHART_BOTTOM_TEMP_ENABLED = false;

const isBetween = (date: Date, start: Date, end: Date): boolean => {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
};

export const filterData = (
  from: string,
  to: string,
  dailyData: DailyData[]
): DailyData[] => {
  const startDate = new Date(from);
  const endDate = new Date(to);
  return dailyData.filter((item) =>
    isBetween(new Date(item.date), startDate, endDate)
  );
};

const getSurveyDates = (surveys: SurveyListItem[]): (number | null)[] => {
  const dates = surveys.map((survey) => {
    if (survey.diveDate) {
      return new Date(survey.diveDate).setHours(0, 0, 0, 0);
    }
    return null;
  });

  return dates;
};

export const sameDay = (
  date1: string | number | Date,
  date2: string | number | Date
) => new Date(date1).toDateString() === new Date(date2).toDateString();

const timeDiff = (incomingDate: string, date: Date) =>
  Math.abs(new Date(incomingDate).getTime() - date.getTime());

export function getDailyDataClosestToDate(dailyData: DailyData[], date: Date) {
  return dailyData.reduce((prevClosest, nextPoint) =>
    timeDiff(prevClosest.date, date) > timeDiff(nextPoint.date, date)
      ? nextPoint
      : prevClosest
  );
}

export function getSpotterDataClosestToDate(
  spotterData: SofarValue[],
  date: Date,
  maxHours: number
) {
  if (spotterData.length === 0) {
    return undefined;
  }

  const closest = spotterData.reduce((prevClosest, nextPoint) =>
    timeDiff(prevClosest.timestamp, date) > timeDiff(nextPoint.timestamp, date)
      ? nextPoint
      : prevClosest
  );

  return timeDiff(closest.timestamp, date) < maxHours * 60 * 60 * 1000
    ? closest
    : undefined;
}

export const createDatasets = (
  dailyData: DailyData[],
  spotterBottomTemperature: SofarValue[],
  spotterSurfaceTemperature: SofarValue[],
  surveys: SurveyListItem[]
) => {
  const bottomTemperature = dailyData
    .filter((item) => item.avgBottomTemperature !== null)
    .map((item) => ({
      x: item.date,
      y: item.avgBottomTemperature,
    }));

  const surfaceTemperature = dailyData
    .filter((item) => item.satelliteTemperature !== null)
    .map((item) => ({ x: item.date, y: item.satelliteTemperature }));

  const surveyDates = getSurveyDates(surveys);

  const spotterBottom = spotterBottomTemperature.map((item) => ({
    x: item.timestamp,
    y: item.value,
  }));

  const spotterSurface = spotterSurfaceTemperature.map((item) => ({
    x: item.timestamp,
    y: item.value,
  }));

  const tempWithSurvey = dailyData
    .filter(
      (item) =>
        item.satelliteTemperature !== null &&
        surveyDates.some(
          (surveyDate) => surveyDate && sameDay(surveyDate, item.date)
        )
    )
    .map((item) => {
      return {
        x: item.date,
        // prioritise bottom temp, if enabled
        y:
          (CHART_BOTTOM_TEMP_ENABLED && item.avgBottomTemperature) ||
          item.satelliteTemperature,
      };
    });

  return {
    // repeat first value, so chart start point isn't instantaneous.
    tempWithSurvey,
    bottomTemperatureData: CHART_BOTTOM_TEMP_ENABLED ? bottomTemperature : [],
    surfaceTemperatureData: surfaceTemperature,
    spotterBottom,
    spotterSurface,
  };
};

export const calculateAxisLimits = (
  dailyData: DailyData[],
  spotterBottomTemperature: SofarValue[],
  spotterSurfaceTemperature: SofarValue[],
  surveys: SurveyListItem[],
  temperatureThreshold: number | null
) => {
  const ySpacing = 1;
  const dates =
    dailyData.length > 0
      ? dailyData
          .filter(
            (item) =>
              item.surfaceTemperature !== null ||
              item.satelliteTemperature !== null
          )
          .map((item) => item.date)
      : spotterBottomTemperature.map((item) => item.timestamp);

  const spotterTimestamps = spotterBottomTemperature.map(
    (item) => item.timestamp
  );
  const spotterXMax = spotterTimestamps.slice(-1)[0];
  const spotterXMin = spotterTimestamps[0];

  const xAxisMax = spotterXMax || dates.slice(-1)[0];

  const xAxisMin =
    spotterXMin ||
    new Date(new Date(dates[0]).setHours(-1, 0, 0, 0)).toISOString();

  const {
    surfaceTemperatureData,
    bottomTemperatureData,
    spotterBottom,
    spotterSurface,
  } = createDatasets(
    dailyData,
    spotterBottomTemperature,
    spotterSurfaceTemperature,
    surveys
  );

  const temperatureData = [
    ...surfaceTemperatureData,
    ...bottomTemperatureData,
    ...spotterBottom,
    ...spotterSurface,
  ]
    .filter((value) => value)
    .map((value) => value.y);

  const yAxisMinTemp = Math.min(...temperatureData) - ySpacing;

  const yAxisMaxTemp = Math.max(...temperatureData) + ySpacing;

  const yAxisMin = Math.round(
    temperatureThreshold
      ? Math.min(yAxisMinTemp, temperatureThreshold - ySpacing)
      : yAxisMinTemp
  );

  const yAxisMax = Math.round(
    temperatureThreshold
      ? Math.max(yAxisMaxTemp, temperatureThreshold + ySpacing)
      : yAxisMaxTemp
  );

  return {
    xAxisMax,
    xAxisMin,
    yAxisMin,
    yAxisMax,
  };
};

export function useProcessedChartData(
  dailyData: ChartProps["dailyData"],
  spotterData: ChartProps["spotterData"],
  surveys: SurveyListItem[],
  temperatureThreshold: ChartProps["temperatureThreshold"]
) {
  // Sort daily data by date
  const sortedDailyData = sortByDate(dailyData, "date");

  const { bottomTemperature, surfaceTemperature } = spotterData || {};

  const datasets = createDatasets(
    sortedDailyData,
    bottomTemperature || [],
    surfaceTemperature || [],
    surveys
  );

  const axisLimits = calculateAxisLimits(
    sortedDailyData,
    bottomTemperature || [],
    surfaceTemperature || [],
    surveys,
    temperatureThreshold
  );
  return { sortedDailyData, ...axisLimits, ...datasets };
}

export type Point = { x: string; y: number | null };

export const createChartData = (
  spotterBottom: ChartPoint[],
  spotterSurface: ChartPoint[],
  tempWithSurvey: ChartPoint[],
  surfaceTemps: ChartPoint[],
  bottomTemps: ChartPoint[],
  fill: boolean
) => {
  const displaySpotterData = spotterSurface.length > 0;
  const data: ChartComponentProps["data"] = {
    datasets: [
      {
        type: "scatter",
        label: "SURVEYS",
        data: tempWithSurvey,
        pointRadius: 5,
        backgroundColor: "#ffffff",
        pointBackgroundColor: "#ffff",
        borderWidth: 1.5,
        borderColor: "#128cc0",
      },
      {
        label: "SURFACE TEMP",
        data: surfaceTemps,
        fill: !displaySpotterData,
        backgroundColor: "rgb(107,193,225,0.2)",
        borderColor: "#6bc1e1",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 0,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "TEMP AT DEPTH",
        data:
          CHART_BOTTOM_TEMP_ENABLED && !displaySpotterData
            ? bottomTemps
            : undefined,
        borderColor: "#46a5cf",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 0,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "SPOTTER BOTTOM",
        data: spotterBottom,
        backgroundColor: "rgb(107,193,225,0.2)",
        borderColor: "#46a5cf",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 0,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "SPOTTER SURFACE",
        data: spotterSurface,
        backgroundColor: "rgb(107,193,225,0.2)",
        borderColor: "#6bc1e1",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 0,
        cubicInterpolationMode: "monotone",
      },
    ],
  };

  if (fill) {
    // eslint-disable-next-line fp/no-mutating-methods
    data.datasets!.splice(1, 0, {
      label: "BLEACHING THRESHOLD",
      data: surfaceTemps,
      fill,
      borderColor: "#6bc1e1",
      borderWidth: 2,
      pointBackgroundColor: "#ffffff",
      pointBorderWidth: 1.5,
      pointRadius: 0,
      cubicInterpolationMode: "monotone",
    });
  }
  return data;
};

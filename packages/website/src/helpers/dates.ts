import moment from "moment-timezone";
import { range as createRange } from "lodash";

import {
  DailyData,
  MonthlyMax,
  MonthlyMaxData,
  Range,
  SofarValue,
  TimeSeries,
} from "../store/Reefs/types";
import { SurveyListItem } from "../store/Survey/types";
import { sortByDate } from "./sortDailyData";

type DateString = string | null | undefined;

interface DisplayDateParams {
  isoDate: DateString;
  format: string;
  displayTimezone: boolean;
  timeZone?: string | null;
  timeZoneToDisplay?: string | null;
}

export const isBefore = (start: string, end: string) =>
  new Date(start).getTime() <= new Date(end).getTime();

export const isBetween = (date: string, start: string, end: string) =>
  isBefore(date, end) && isBefore(start, date);

export const subtractFromDate = (
  endDate: string,
  amount: Range,
  multiple?: number
): string => {
  switch (amount) {
    case "day":
      return moment(endDate)
        .subtract(multiple || 1, "days")
        .toISOString();
    case "week":
      return moment(endDate)
        .subtract(multiple || 1, "weeks")
        .toISOString();
    case "month":
      return moment(endDate)
        .subtract(multiple || 1, "months")
        .toISOString();
    case "year":
      return moment(endDate)
        .subtract(multiple || 1, "years")
        .toISOString();
    default:
      return endDate;
  }
};

export const toRelativeTime = (timestamp: Date | string | number) => {
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;

  const now = new Date().getTime();
  const start = new Date(timestamp).getTime();

  const timePeriodInSeconds = Math.floor((now - start) / 1000);
  const timePeriodInMinutes = Math.floor(timePeriodInSeconds / minute);
  const timePeriodInHours = Math.floor(timePeriodInSeconds / hour);
  const timePeriodInDays = Math.floor(timePeriodInSeconds / day);

  switch (true) {
    case timePeriodInSeconds < minute:
      return `${timePeriodInSeconds} sec. ago`;
    case timePeriodInSeconds < hour:
      return `${timePeriodInMinutes} min. ago`;
    case timePeriodInSeconds < day:
      return `${timePeriodInHours} hour${timePeriodInHours > 1 ? "s" : ""} ago`;
    default:
      return `${timePeriodInDays} day${timePeriodInDays > 1 ? "s" : ""} ago`;
  }
};

/**
 * Depending on the type param, it calculates the maximum or minimun date
 * for the combined temperature data
 * @param dailyData - Array of daily data
 * @param spotterData - Object of spotterData (optional)
 * @param hoboBottomTemperature - Array of HOBO data (optional)
 * @param type - Type of date we seek (defaults to "max")
 */
export const findMarginalDate = (
  monthlyMaxData: MonthlyMaxData[],
  dailyData: DailyData[],
  spotterData?: TimeSeries,
  hoboBottomTemperature?: SofarValue[],
  type: "min" | "max" = "max"
): string => {
  const combinedData = [
    ...monthlyMaxData,
    ...dailyData,
    ...(spotterData?.surfaceTemperature?.map((item) => ({
      date: item.timestamp,
      value: item.value,
    })) || []),
    ...(spotterData?.bottomTemperature?.map((item) => ({
      date: item.timestamp,
      value: item.value,
    })) || []),
    ...(hoboBottomTemperature?.map((item) => ({
      date: item.timestamp,
      value: item.value,
    })) || []),
  ];

  const sortedData = sortByDate(
    combinedData,
    "date",
    type === "max" ? "desc" : "asc"
  );

  return sortedData[0].date;
};

export const findChartPeriod = (range: Range) => {
  switch (range) {
    case "day":
      return "hour";
    case "week":
    default:
      return "day";
  }
};

export function setTimeZone(date: Date, timeZone?: string | null): string;

export function setTimeZone(
  date: Date | null,
  timeZone?: string | null
): string | null;

// Returns the same date but for a different time zone
export function setTimeZone(date: Date | null, timeZone?: string | null) {
  if (date && timeZone) {
    const localTime = new Date(date.toLocaleString("en-US", { timeZone }));
    const diff = date.getTime() - localTime.getTime();
    return new Date(date.getTime() + diff).toISOString();
  }
  return date?.toISOString() || null;
}

export const getTimeZoneName = (timeZone: string): string => {
  const rawTimeZoneName = moment().tz(timeZone).format("z");
  // Only add GMT prefix to raw time differences and not acronyms such as PST.
  const needsGMT =
    rawTimeZoneName.includes("+") || rawTimeZoneName.includes("-");
  return `${needsGMT ? "GMT" : ""}${rawTimeZoneName}`;
};

export const displayTimeInLocalTimezone = ({
  isoDate,
  format,
  displayTimezone,
  timeZone,
  timeZoneToDisplay,
}: DisplayDateParams) => {
  if (isoDate) {
    const timeZoneName = getTimeZoneName(
      timeZoneToDisplay || timeZone || "UTC"
    );
    const dateString = moment(isoDate)
      .tz(timeZone || "UTC")
      .format(format);

    return `${dateString}${displayTimezone ? ` ${timeZoneName}` : ""}`;
  }
  return isoDate;
};

// The following functions are used to trick Chart.js
// In general Chart.js converts dates and displays them to user's local time zone
// If for example a date is equal to 2021-01-01T22:19:01 in site's local time then
// this must be converted to user's 2021-01-01T22:19:01 local time.

const userLocalTimeZoneOffset = new Date().getTimezoneOffset();

/**
 * Converts site's local time to user's local time
 * @param isotTime - Site's local time in ISO format
 * @param timeZone - Site's time zone
 */
export const convertToLocalTime = (
  isoTime: string,
  timeZone?: string | null
) => {
  // Example usage
  // isoTime = 2021-01-31T23:59:59.999Z,
  // timeZone = "America/New_York",
  // userLocalTimeZoneOffset = -120 (Europe/Athens)

  // siteLocalTimeIgnoreTimeZone = 2021-01-31T18:59:59.999Z
  const siteLocalTimeIgnoreTimeZone = moment(isoTime)
    .tz(timeZone || "UTC")
    .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");

  // userLocalTimeIgnoreTimeZone = 2021-01-31T16:59:59.999Z
  const userLocalTimeIgnoreTimeZone = moment(siteLocalTimeIgnoreTimeZone)
    .utcOffset(userLocalTimeZoneOffset)
    .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");

  // This value going to be interpreted as 2021-01-31T18:59:59.999Z
  // in user's local time zone from Chart.js, which is exactly what
  // we want
  return userLocalTimeIgnoreTimeZone;
};

export const convertDailyDataToLocalTime = (
  dailyData: DailyData[],
  timeZone?: string | null
): DailyData[] =>
  dailyData.map((item) => ({
    ...item,
    date: convertToLocalTime(item.date, timeZone),
  }));

export const convertSofarDataToLocalTime = (
  sofarData: SofarValue[],
  timeZone?: string | null
): SofarValue[] =>
  sofarData.map((item) => ({
    ...item,
    timestamp: convertToLocalTime(item.timestamp, timeZone),
  }));

export const convertTimeSeriesToLocalTime = (
  timeSeries?: TimeSeries,
  timeZone?: string | null
): TimeSeries | undefined => {
  if (!timeSeries) {
    return timeSeries;
  }
  return {
    alert: convertSofarDataToLocalTime(timeSeries.alert, timeZone),
    dhw: convertSofarDataToLocalTime(timeSeries.dhw, timeZone),
    satelliteTemperature: convertSofarDataToLocalTime(
      timeSeries.satelliteTemperature,
      timeZone
    ),
    surfaceTemperature: convertSofarDataToLocalTime(
      timeSeries.surfaceTemperature,
      timeZone
    ),
    bottomTemperature: convertSofarDataToLocalTime(
      timeSeries.bottomTemperature,
      timeZone
    ),
    sstAnomaly: convertSofarDataToLocalTime(timeSeries.sstAnomaly, timeZone),
    significantWaveHeight: convertSofarDataToLocalTime(
      timeSeries.significantWaveHeight,
      timeZone
    ),
    wavePeakPeriod: convertSofarDataToLocalTime(
      timeSeries.wavePeakPeriod,
      timeZone
    ),
    waveMeanDirection: convertSofarDataToLocalTime(
      timeSeries.waveMeanDirection,
      timeZone
    ),
    windSpeed: convertSofarDataToLocalTime(timeSeries.windSpeed, timeZone),
    windDirection: convertSofarDataToLocalTime(
      timeSeries.windDirection,
      timeZone
    ),
  };
};

export const convertSurveyDataToLocalTime = (
  surveys: SurveyListItem[],
  timeZone?: string | null
): SurveyListItem[] =>
  surveys.map((survey) => ({
    ...survey,
    diveDate: survey.diveDate
      ? convertToLocalTime(survey.diveDate, timeZone)
      : survey.diveDate,
  }));

// Return a copy of monthly max data for each year
export const generateMonthlyMaxTimestamps = (
  monthlyMax: MonthlyMax[],
  startDate?: string,
  endDate?: string,
  timeZone?: string | null
): MonthlyMaxData[] => {
  const startYear = startDate
    ? new Date(startDate).getFullYear()
    : new Date().getFullYear();
  const endYear = endDate
    ? new Date(endDate).getFullYear()
    : new Date().getFullYear();

  const years = createRange(startYear - 1, endYear + 1);

  const yearlyData = years.map((year) => {
    return monthlyMax.map(({ month, temperature }) => ({
      value: temperature,
      date: convertToLocalTime(
        moment()
          .set({
            year,
            month: month - 1,
            date: 15,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        timeZone
      ),
    }));
  });

  return yearlyData.reduce<MonthlyMaxData[]>(
    (curr, item) => [...curr, ...item],
    []
  );
};

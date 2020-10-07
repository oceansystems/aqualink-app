/* eslint-disable no-nested-ternary */
import type { TableRow } from "../Homepage/types";
import type { Reef } from "./types";
import { degreeHeatingWeeksCalculator } from "../../helpers/degreeHeatingWeeks";

export function getReefNameAndRegion(reef: Reef) {
  const name = reef.name || reef.region?.name || null;
  const region = reef.name ? reef.region?.name : null;
  return { name, region };
}

const longDHW = (dhw: number | null): string =>
  `0000${dhw ? Math.round(dhw * 10) : "0"}`.slice(-4);

export const constructTableData = (list: Reef[]): TableRow[] => {
  return list.map((value, key) => {
    const {
      degreeHeatingDays,
      satelliteTemperature,
      maxBottomTemperature,
      weeklyAlertLevel,
    } = value.latestDailyData || {};
    const dhw = degreeHeatingWeeksCalculator(degreeHeatingDays);
    const { maxMonthlyMean } = value;
    const locationName = getReefNameAndRegion(value).name;

    return {
      locationName,
      temp: maxBottomTemperature || satelliteTemperature,
      maxMonthlyMean,
      depth: value.depth,
      dhw,
      tableData: {
        id: key,
      },
      alert: `${weeklyAlertLevel || 0},${longDHW(dhw)}`,
      alertLevel: weeklyAlertLevel || null,
    };
  });
};

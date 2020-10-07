import noStress from "../assets/alerts/alert_nostress.svg";
import warning from "../assets/alerts/alert_warning.svg";
import watch from "../assets/alerts/alert_watch.svg";
import lvl1 from "../assets/alerts/alert_lvl1.svg";
import lvl2 from "../assets/alerts/alert_lvl2.svg";
import pinNoStress from "../assets/alerts/pin_nostress@2x.png";
import pinWatch from "../assets/alerts/pin_watch@2x.png";
import pinWarning from "../assets/alerts/pin_warning@2x.png";
import pinLvl1 from "../assets/alerts/pin_lvl1@2x.png";
import pinLvl2 from "../assets/alerts/pin_lvl2@2x.png";

export type Interval = {
  image: string;
  color: string;
  icon: string;
  level: number;
};

/**
 * Calculating bleaching alert level based on NOAA defintions:
 * available at https://coralreefwatch.noaa.gov/subscriptions/vs.php
 * @param temperatureThreshold
 * @param satelliteTemperature
 * @param degreeHeatingWeeks
 */
export const findIntervalByLevel = (
  weeklyAlertLevel?: number | null
): Interval => {
  switch (weeklyAlertLevel) {
    case null:
    case undefined:
    case 0:
      return {
        image: noStress,
        color: "#C6E5FA",
        icon: pinNoStress,
        level: 0,
      };

    case 1:
      return {
        image: watch,
        color: "#FFF200",
        icon: pinWatch,
        level: 1,
      };

    case 2:
      return {
        image: warning,
        color: "#F8AB00",
        icon: pinWarning,
        level: 2,
      };

    case 3:
      return {
        image: lvl1,
        color: "#EF0000",
        icon: pinLvl1,
        level: 3,
      };

    case 4:
      return {
        image: lvl2,
        color: "#940000",
        icon: pinLvl2,
        level: 4,
      };

    default:
      return {
        image: noStress,
        color: "#C6E5FA",
        icon: pinNoStress,
        level: 0,
      };
  }
};

export const findMaxLevel = (intervals: Interval[]): number => {
  const levels = intervals.map((item) => item.level);
  return Math.max(...levels);
};

export const getColorByLevel = (level: number): string => {
  return findIntervalByLevel(level).color;
};

export const alertIconFinder = (weeklyAlertLevel?: number | null): string => {
  return findIntervalByLevel(weeklyAlertLevel).icon;
};

export const alertColorFinder = (weeklyAlertLevel?: number | null): string => {
  return findIntervalByLevel(weeklyAlertLevel).color;
};

export default { findIntervalByLevel, alertColorFinder, alertIconFinder };

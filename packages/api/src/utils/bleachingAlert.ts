import { isNil, isNumber, inRange } from 'lodash';

/**
 * Calculating bleaching alert level based on NOAA defintions:
 * available at https://coralreefwatch.noaa.gov/subscriptions/vs.php
 * @param temperatureThreshold
 * @param satelliteTemperature
 * @param degreeHeatingDays
 */
export const calculateAlertLevel = (
  maxMonthlyMean: number | null,
  satelliteTemperature?: number | null,
  degreeHeatingDays?: number | null,
): number | undefined => {
  const hotSpot =
    satelliteTemperature &&
    maxMonthlyMean &&
    satelliteTemperature - maxMonthlyMean;

  switch (true) {
    case isNil(hotSpot):
      return undefined;

    case isNumber(hotSpot) && hotSpot <= 0:
      return 0;

    case isNumber(hotSpot) && hotSpot < 1:
      return 1;

    // Hotspot >=1 or nil past this point, start dhw checks.
    case isNil(degreeHeatingDays):
      return 0;

    case inRange(degreeHeatingDays!, 0, 4 * 7):
      return 2;

    case inRange(degreeHeatingDays!, 4 * 7, 8 * 7):
      return 3;

    case degreeHeatingDays! >= 8 * 7:
      return 4;

    default:
      return undefined;
  }
};

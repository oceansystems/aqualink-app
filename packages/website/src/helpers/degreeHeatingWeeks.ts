import { isNil, isNumber } from "lodash";
import { dhwColorCode } from "../assets/colorCode";

export const degreeHeatingWeeksCalculator = (degreeHeatingDays?: number) =>
  isNumber(degreeHeatingDays) ? degreeHeatingDays / 7 : null;

export const dhwColorFinder = (degreeHeatingWeeks?: number | null): string => {
  const len = dhwColorCode.length;

  if (isNil(degreeHeatingWeeks) || degreeHeatingWeeks < dhwColorCode[0].value) {
    return dhwColorCode[0].color;
  }
  if (degreeHeatingWeeks > dhwColorCode[len - 1].value) {
    return dhwColorCode[len - 1].color;
  }
  const index = dhwColorCode.findIndex(
    (item) => degreeHeatingWeeks < item.value
  );
  return dhwColorCode[index - 1].color;
};

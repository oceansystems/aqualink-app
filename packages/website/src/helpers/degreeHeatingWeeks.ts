import { colorCode } from "../assets/colorCode";

export const degreeHeatingWeeksCalculator = (value?: number): number =>
  value ? Math.round((value / 7) * 10) / 10 : 0;

export const colorFinder = (value: number): string => {
  const len = colorCode.length;

  if (value < colorCode[0].value) {
    return colorCode[0].color;
  }
  if (value > colorCode[len - 1].value) {
    return colorCode[len - 1].color;
  }
  const index = colorCode.findIndex((item) => value < item.value);
  return colorCode[index - 1].color;
};

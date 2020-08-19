import type { Point, Polygon, Position } from "../store/Reefs/types";

export const locationCalculator = (point: Point | Polygon): Position => {
  if (point.type === "Point") {
    return point.coordinates;
  }

  const coordArray = point.coordinates[0];
  const len = coordArray.length;
  const lngArray = coordArray.map((item) => item[0]);
  const latArray = coordArray.map((item) => item[1]);

  const lngMean = lngArray.reduce((a, b) => a + b) / len;
  const latMean = latArray.reduce((a, b) => a + b) / len;

  return [lngMean, latMean];
};

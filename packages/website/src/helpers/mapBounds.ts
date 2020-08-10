import { latLngBounds, LatLngBounds } from "leaflet";

import { Polygon } from "../store/Reefs/types";

export const mapBounds = (polygon: Polygon): LatLngBounds => {
  const latArr = polygon.coordinates[0].map((coord) => coord[1]);
  const lngArr = polygon.coordinates[0].map((coord) => coord[0]);

  const north = Math.max(...latArr);
  const south = Math.min(...latArr);
  const east = Math.max(...lngArr);
  const west = Math.min(...lngArr);

  return latLngBounds([south, west], [north, east]);
};

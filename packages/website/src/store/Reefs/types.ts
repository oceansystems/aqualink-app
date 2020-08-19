/* eslint-disable camelcase */
export type Position = [number, number];

export interface Polygon {
  coordinates: [Position[]];
  type: "Polygon";
}

export interface Point {
  coordinates: Position;
  type: "Point";
}

export interface Data {
  id: number;
  date: string;

  minBottomTemperature: number;
  maxBottomTemperature: number;
  avgBottomTemperature: number;

  degreeHeatingDays: number;
  surfaceTemperature: number;
  satelliteTemperature: number;

  minWindSpeed: number;
  maxWindSpeed: number;
  avgWindSpeed: number;
  windDirection: number;

  minWaveHeight: number;
  maxWaveHeight: number;
  avgWaveHeight: number;
  waveDirection: number;
  wavePeriod: number;
}

export interface Reef {
  id: number;
  name: string | null;
  polygon: Polygon | Point;
  maxMonthlyMean: number | null;
  depth: number | null;
  status: number;
  videoStream: string | null;
  region: string | null;
  admin: string | null;
  stream: string | null;
  dailyData: Data[];
  latestDailyData: Data;
}

export interface ReefsListState {
  list: Reef[];
  loading: boolean;
  error?: string | null;
}

export interface SelectedReefState {
  details?: Reef;
  loading: boolean;
  error?: string | null;
}

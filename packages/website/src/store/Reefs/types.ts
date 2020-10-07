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

export interface Pois {
  id: number;
  name: string | null;
}

export interface SofarValue {
  timestamp: string;
  value: number;
}

export interface LiveData {
  reef: { id: number };
  bottomTemperature?: SofarValue;
  surfaceTemperature?: SofarValue;
  satelliteTemperature?: SofarValue;
  degreeHeatingDays?: SofarValue;
  waveHeight?: SofarValue;
  waveDirection?: SofarValue;
  wavePeriod?: SofarValue;
  windSpeed?: SofarValue;
  windDirection?: SofarValue;
  weeklyAlertLevel?: number;
}

export interface DailyData {
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

  weeklyAlertLevel?: number;
}

interface Region {
  name: string | null;
}

export interface Reef {
  id: number;
  name: string | null;
  polygon: Polygon | Point;
  maxMonthlyMean: number | null;
  depth: number | null;
  status: number;
  videoStream: string | null;
  region: Region | null;
  admin: string | null;
  stream: string | null;
  dailyData: DailyData[];
  liveData: LiveData;
  latestDailyData: DailyData;
  featuredImage?: string;
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

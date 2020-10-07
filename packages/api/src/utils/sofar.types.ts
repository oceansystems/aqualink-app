export interface SofarValue {
  timestamp: string;
  value: number;
}

export interface SofarDailyData {
  reef: { id: number };
  date: Date;
  dailyAlertLevel?: number;
  weeklyAlertLevel?: number;
  minBottomTemperature?: number;
  maxBottomTemperature?: number;
  avgBottomTemperature?: number;
  surfaceTemperature?: number;
  satelliteTemperature?: number;
  degreeHeatingDays?: number;
  minWaveHeight?: number;
  maxWaveHeight?: number;
  avgWaveHeight?: number;
  waveDirection?: number;
  wavePeriod?: number;
  minWindSpeed?: number;
  maxWindSpeed?: number;
  avgWindSpeed?: number;
  windDirection?: number;
}

export interface SofarLiveData {
  reef: { id: number };
  dailyAlertLevel?: number;
  weeklyAlertLevel?: number;
  bottomTemperature?: SofarValue;
  surfaceTemperature?: SofarValue;
  satelliteTemperature?: SofarValue;
  degreeHeatingDays?: SofarValue;
  waveHeight?: SofarValue;
  waveDirection?: SofarValue;
  wavePeriod?: SofarValue;
  windSpeed?: SofarValue;
  windDirection?: SofarValue;
  spotterPosition?: {
    latitude: SofarValue;
    longitude: SofarValue;
  };
}

export interface SpotterData {
  surfaceTemperature: SofarValue[];
  bottomTemperature: SofarValue[];
  significantWaveHeight: SofarValue[];
  wavePeakPeriod: SofarValue[];
  waveMeanDirection: SofarValue[];
  latitude?: SofarValue[];
  longitude?: SofarValue[];
}

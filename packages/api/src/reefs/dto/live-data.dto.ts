import { TimeSeriesValueDto } from '../../time-series/dto/time-series-value.dto';
import { SofarLiveData } from '../../utils/sofar.types';

export class SofarLiveDataDto implements SofarLiveData {
  reef: { id: number };
  dailyAlertLevel?: number;
  weeklyAlertLevel?: number;
  bottomTemperature?: TimeSeriesValueDto;
  topTemperature?: TimeSeriesValueDto;
  satelliteTemperature?: TimeSeriesValueDto;
  degreeHeatingDays?: TimeSeriesValueDto;
  waveHeight?: TimeSeriesValueDto;
  waveDirection?: TimeSeriesValueDto;
  wavePeriod?: TimeSeriesValueDto;
  windSpeed?: TimeSeriesValueDto;
  windDirection?: TimeSeriesValueDto;
  sstAnomaly?: number;
  spotterPosition?: {
    latitude: TimeSeriesValueDto;
    longitude: TimeSeriesValueDto;
  };
}

import { DeepPartial } from 'typeorm';
import { SourceType } from '../../src/reefs/schemas/source-type.enum';
import { Sources } from '../../src/reefs/sources.entity';
import { athensReef, californiaReef, floridaReef } from './reef.mock';
import { athensPoiPiraeus } from './poi.mock';

export const californiaSpotterSource: DeepPartial<Sources> = {
  reef: californiaReef,
  type: SourceType.SPOTTER,
  sensorId: californiaReef.sensorId,
};

export const californiaNOAASource: DeepPartial<Sources> = {
  reef: californiaReef,
  type: SourceType.NOAA,
};

export const floridaNOAASource: DeepPartial<Sources> = {
  reef: floridaReef,
  type: SourceType.NOAA,
};

export const athensNOAASource: DeepPartial<Sources> = {
  reef: athensReef,
  type: SourceType.NOAA,
};

export const athensPiraeusHoboSource: DeepPartial<Sources> = {
  reef: athensReef,
  poi: athensPoiPiraeus,
  type: SourceType.HOBO,
};

export const sources = [
  californiaSpotterSource,
  californiaNOAASource,
  floridaNOAASource,
  athensNOAASource,
  athensPiraeusHoboSource,
];

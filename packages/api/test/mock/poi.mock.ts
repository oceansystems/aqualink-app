import { DeepPartial } from 'typeorm';
import { athensReef, californiaReef, floridaReef } from './reef.mock';
import { ReefPointOfInterest } from '../../src/reef-pois/reef-pois.entity';
import { createPoint } from '../../src/utils/coordinates';

export const athensPoiPiraeus: DeepPartial<ReefPointOfInterest> = {
  imageUrl: 'http://some-sample-url.com',
  name: 'Piraeus',
  reef: athensReef,
  polygon: createPoint(23.666694170726828, 37.92090950501416),
};

export const floridaPoiOne: DeepPartial<ReefPointOfInterest> = {
  imageUrl: 'http://some-sample-url.com',
  name: 'Spot One',
  reef: floridaReef,
  polygon: createPoint(-81.27384406004956, 24.617057340809524),
};

export const floridaPoiTwo: DeepPartial<ReefPointOfInterest> = {
  imageUrl: 'http://some-sample-url.com',
  name: 'Spot Two',
  reef: floridaReef,
  polygon: createPoint(-81.62632276694188, 24.966140159912975),
};

export const californiaPoi: DeepPartial<ReefPointOfInterest> = {
  imageUrl: 'http://some-sample-url.com',
  name: 'California Poi',
  reef: californiaReef,
  polygon: createPoint(-110.25009575059113, 24.647017162630366),
};

export const pois = [
  athensPoiPiraeus,
  floridaPoiOne,
  floridaPoiTwo,
  californiaPoi,
];

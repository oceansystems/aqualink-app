import { Client, AddressType } from '@googlemaps/google-maps-services-js';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Point } from 'geojson';
import geoTz from 'geo-tz';
import { Region } from '../regions/regions.entity';

const googleMapsClient = new Client({});
const logger = new Logger('Reef Utils');

const getCountry = async (
  longitude: number,
  latitude: number,
): Promise<string | undefined> => {
  return googleMapsClient
    .reverseGeocode({
      params: {
        latlng: [latitude, longitude],
        result_type: [AddressType.country],
        key: process.env.GOOGLE_MAPS_API_KEY || '',
      },
    })
    .then((r) => {
      const { results } = r.data;
      return results.length > 0 ? results[0].formatted_address : undefined;
    })
    .catch((e) => {
      logger.error(
        e.response
          ? e.response.data.error_message
          : 'An unknown error occurred.',
        e,
      );
      return undefined;
    });
};

export const getRegion = async (
  longitude: number,
  latitude: number,
  regionRepository: Repository<Region>,
) => {
  const country = await getCountry(longitude, latitude);
  const region = await regionRepository.findOne({ where: { name: country } });

  if (region) {
    return region;
  }

  return country
    ? regionRepository.save({
        name: country,
        polygon: {
          coordinates: [latitude, longitude],
          type: 'Point',
        } as Point,
      })
    : undefined;
};

export const getTimezones = (latitude: number, longitude: number) => {
  return geoTz(latitude, longitude);
};

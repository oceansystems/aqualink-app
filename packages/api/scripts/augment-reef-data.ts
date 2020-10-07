import { isNil, omitBy } from 'lodash';
import {
  Client,
  AddressType,
  LatLng,
} from '@googlemaps/google-maps-services-js';
import Bluebird from 'bluebird';
import { Connection, createConnection, Repository } from 'typeorm';
import { Point, GeoJSON } from 'geojson';
import geoTz from 'geo-tz';
import { Reef } from '../src/reefs/reefs.entity';
import { Region } from '../src/regions/regions.entity';
import { getMMM } from '../src/utils/temperature';

const googleMapsClient = new Client({});

const dbConfig = require('../ormconfig');

async function getCountry(longitude, latitude): Promise<string | undefined> {
  return googleMapsClient
    .reverseGeocode({
      params: {
        latlng: [latitude, longitude] as LatLng,
        result_type: ['country' as AddressType],
        key: process.env.GOOGLE_MAPS_API_KEY || '',
      },
    })
    .then((r) => {
      const { results } = r.data;
      return results.length > 0 ? results[0].formatted_address : undefined;
    })
    .catch((e) => {
      console.log(
        e.response ? e.response.data.error_message : 'An unkown error occured.',
      );
      return undefined;
    });
}

async function getRegion(
  longitude: number,
  latitude: number,
  regionRepository: Repository<Region>,
) {
  const country = await getCountry(longitude, latitude);
  const regions = await regionRepository.find({ where: { name: country } });

  if (regions.length > 0) {
    return regions[0];
  }

  return country
    ? regionRepository.save({
        name: country,
        polygon: {
          coordinates: [latitude, longitude],
          type: 'Point',
        } as GeoJSON,
      })
    : undefined;
}

async function getAugmentedData(
  reef: Reef,
  regionRepository: Repository<Region>,
) {
  const [longitude, latitude] = (reef.polygon as Point).coordinates;

  const region =
    reef.region || (await getRegion(longitude, latitude, regionRepository));

  const MMM = await getMMM(longitude, latitude);
  if (MMM === null) {
    console.warn(
      `Max Monthly Mean appears to be null for Reef ${reef.name} at (lat, lon): (${latitude}, ${longitude}) `,
    );
  }

  const timezones = geoTz(latitude, longitude);

  return omitBy(
    {
      region,
      timezone: timezones.length > 0 ? timezones[0] : null,
      maxMonthlyMean: MMM,
    },
    isNil,
  );
}

async function augmentReefs(connection: Connection) {
  const reefRepository = connection.getRepository(Reef);
  const regionRepository = connection.getRepository(Region);
  const allReefs = await reefRepository.find();

  const start = new Date();
  console.log(`Augmenting ${allReefs.length} reefs...`);
  await Bluebird.map(
    allReefs,
    async (reef) => {
      const augmentedData = await getAugmentedData(reef, regionRepository);
      await reefRepository.update(reef.id, augmentedData);
    },
    { concurrency: 1 },
  );
  console.log(
    `Augmented ${allReefs.length} reefs in ${
      (new Date().valueOf() - start.valueOf()) / 1000
    } seconds`,
  );
}

async function run() {
  createConnection(dbConfig).then(async (connection) => {
    await augmentReefs(connection);
  });
}

run();

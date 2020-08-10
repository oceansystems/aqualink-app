import { Connection, createConnection } from 'typeorm';
import { Point } from 'geojson';
import geoTz from 'geo-tz';
import { Reef } from '../src/reefs/reefs.entity';
import { getMMM } from '../src/utils/temperature';

const dbConfig = require('../ormconfig');

async function augmentReefs(connection: Connection) {
  const reefRepository = connection.getRepository(Reef);
  const allReefs = await reefRepository.find();
  return Promise.all(
    allReefs.map(async (reef) => {
      const [longitude, latitude] = (reef.polygon as Point).coordinates;
      const MMM = await getMMM(longitude, latitude);
      if (MMM === null) {
        console.warn(
          `Max Monthly Mean appears to be null for Reef ${reef.name} at (lat, lon): (${latitude}, ${longitude}) `,
        );
      }
      const res = await reefRepository.update(reef.id, {
        timezone: geoTz(latitude, longitude)[0],
        maxMonthlyMean: MMM,
      });
      return res;
    }),
  );
}

async function run() {
  createConnection(dbConfig).then(async (connection) => {
    await augmentReefs(connection);
  });
}

run();

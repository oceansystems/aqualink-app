/* eslint-disable no-param-reassign, fp/no-mutation */
import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Reef } from '../reefs/reefs.entity';

// Reef Factory
define(Reef, (faker: typeof Faker) => {
  const reef = new Reef();
  reef.name = `Mock Reef ${faker.name.lastName()}`;
  const lat = faker.random.number({ min: -900, max: 900 }) / 10;
  const lng = faker.random.number({ min: -1800, max: 1800 }) / 10;
  reef.polygon = {
    type: 'Point',
    coordinates: [lng, lat],
  };
  reef.temperatureThreshold = faker.random.number({ min: 25, max: 27 });
  reef.depth = faker.random.number({ min: 10, max: 40 });
  reef.status = faker.random.number(1);
  return reef;
});

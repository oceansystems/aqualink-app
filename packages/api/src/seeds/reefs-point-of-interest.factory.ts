import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';

define(ReefPointOfInterest, (faker: typeof Faker) => {
  const reefPointOfInterest = new ReefPointOfInterest();

  reefPointOfInterest.name = `Mock Reef Point Of Interest ${faker.name.lastName()}`;

  return reefPointOfInterest;
});

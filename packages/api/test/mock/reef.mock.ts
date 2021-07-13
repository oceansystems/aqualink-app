import { DeepPartial } from 'typeorm';
import { Reef, ReefStatus } from '../../src/reefs/reefs.entity';
import { createPoint } from '../../src/utils/coordinates';

// The repository.save method will amend the following mocks with the other auto-generated columns
// is, createdAt, updatedAt

export const californiaReef: DeepPartial<Reef> = {
  name: 'California Site',
  sensorId: 'SPOT-0930',
  polygon: createPoint(-113.79279081056211, 25.085598897064777),
  depth: 43,
  status: ReefStatus.Deployed,
  maxMonthlyMean: 28.54,
  timezone: 'America/Los_Angeles',
  approved: true,
  applied: true,
};

export const floridaReef: DeepPartial<Reef> = {
  name: 'Florida Site',
  polygon: createPoint(-81.4616546356848, 25.085598897064777),
  depth: 24,
  status: ReefStatus.Approved,
  maxMonthlyMean: 30.54,
  timezone: 'America/Los_Angeles',
  approved: true,
  applied: false,
};

export const athensReef: DeepPartial<Reef> = {
  name: 'Athens Site',
  polygon: createPoint(37.57941251343841, 23.65678288302115),
  depth: 15,
  sensorId: 'SPOT-300434063450120',
  status: ReefStatus.Shipped,
  maxMonthlyMean: 25.54,
  timezone: 'America/Havana',
  approved: true,
  applied: true,
};

export const reefs = [californiaReef, floridaReef, athensReef];

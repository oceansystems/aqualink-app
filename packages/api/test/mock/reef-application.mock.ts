import { DeepPartial } from 'typeorm';
import { ReefApplication } from '../../src/reef-applications/reef-applications.entity';
import { californiaReef, floridaReef } from './reef.mock';
import { reefManagerUserMock } from './user.mock';

export const californiaReefApplication: DeepPartial<ReefApplication> = {
  permitRequirements: 'Permit Requirements',
  fundingSource: 'Funding source',
  installationResources: 'Installation resources',
  installationSchedule: new Date('2019-01-01'),
  targetShipdate: new Date('2019-03-01'),
  trackingUrl: 'https://www.tracking-service.com/bouy123',
  reef: californiaReef,
  user: reefManagerUserMock,
};

export const floridaReefApplication: DeepPartial<ReefApplication> = {
  reef: floridaReef,
  user: reefManagerUserMock,
};

export const reefApplications = [
  californiaReefApplication,
  floridaReefApplication,
];

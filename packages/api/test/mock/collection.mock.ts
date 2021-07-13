import { DeepPartial } from 'typeorm';
import { Collection } from '../../src/collections/collections.entity';
import { athensReef, californiaReef, floridaReef } from './reef.mock';
import { adminUserMock, defaultUserMock } from './user.mock';

export const adminCollectionMock: DeepPartial<Collection> = {
  isPublic: true,
  name: 'Admin Dashboard',
  reefs: [floridaReef, californiaReef, athensReef],
  user: adminUserMock,
};

export const defaultCollectionMock: DeepPartial<Collection> = {
  isPublic: false,
  name: 'Default User Dashboard',
  user: defaultUserMock,
};

export const collections = [adminCollectionMock, defaultCollectionMock];

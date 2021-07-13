import { DeepPartial } from 'typeorm';
import { AdminLevel, User } from '../../src/users/users.entity';
import { createPoint } from '../../src/utils/coordinates';
import { createMockFirebaseUser } from '../utils';

// The repository.save method will amend the following mocks with the other auto-generated columns
// is, createdAt, updatedAt
export const adminUserMock: DeepPartial<User> = {
  firebaseUid: 'abc1234',
  fullName: 'John Doe',
  email: 'johndoe@example.com',
  organization: 'John Foundations',
  location: createPoint(-113.00825255521971, 27.52775820686191),
  country: 'USA',
  adminLevel: AdminLevel.SuperAdmin,
  description: 'A test super admin user',
  imageUrl: 'http://some-sample-url.com',
};

export const reefManagerUserMock: DeepPartial<User> = {
  fullName: 'John Manager',
  email: 'johnmanager@example.com',
  organization: 'John M Foundations',
  location: createPoint(-80.92402664087751, 27.605670826465445),
  country: 'USA',
  adminLevel: AdminLevel.ReefManager,
  description: 'A test reef manager user',
  imageUrl: 'http://some-sample-url.com',
};

export const defaultUserMock: DeepPartial<User> = {
  firebaseUid: 'abc1234simple',
  fullName: 'John Simple',
  email: 'johnsimple@example.com',
  organization: 'John S Foundations',
  location: createPoint(23.934204963785533, 38.134556577054134),
  country: 'Greece',
  adminLevel: AdminLevel.Default,
  description: 'A test default user',
  imageUrl: 'http://some-sample-url.com',
};

export const testUserMock: DeepPartial<User> = {
  firebaseUid: 'testTestTest',
  fullName: 'Test Test',
  email: 'test@test.com',
  organization: 'Test Foundations',
  location: createPoint(23.934204963785533, 38.134556577054134),
  country: 'Greece',
  adminLevel: AdminLevel.Default,
  description: 'A test default user',
  imageUrl: 'http://some-sample-url.com',
};

export const users = [adminUserMock, reefManagerUserMock, defaultUserMock];

export const testFirebaseUserMock = createMockFirebaseUser(
  testUserMock.firebaseUid as string,
  testUserMock.email as string,
);

export const adminFirebaseUserMock = createMockFirebaseUser(
  adminUserMock.firebaseUid as string,
  adminUserMock.email as string,
);

export const reefManagerFirebaseUserMock = createMockFirebaseUser(
  'abc1234manager',
  reefManagerUserMock.email as string,
);

export const defaultFirebaseUserMock = createMockFirebaseUser(
  defaultUserMock.firebaseUid as string,
  defaultUserMock.email as string,
);

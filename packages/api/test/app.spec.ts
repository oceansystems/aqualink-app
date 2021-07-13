import { INestApplication } from '@nestjs/common';
import { TestService } from './test.service';
import { healthCheckTests } from '../src/health-check/health-check.spec';
import { userTests } from '../src/users/users.spec';
import { collectionTests } from '../src/collections/collections.spec';
import { timeSeriesTests } from '../src/time-series/time-series.spec';
import { regionTests } from '../src/regions/regions.spec';
import { poiTests } from '../src/reef-pois/reef-pois.spec';
import { reefApplicationTests } from '../src/reef-applications/reef-application.spec';
import { surveyTests } from '../src/surveys/surveys.spec';
import { reefTests } from '../src/reefs/reefs.spec';
import { sensorTests } from '../src/sensors/sensors.spec';

describe('AppController (e2e)', () => {
  const testService = TestService.getInstance();
  let app: INestApplication;

  beforeAll(async () => {
    // Initialize app
    app = await testService.getApp();
  });

  it('App is defined', () => {
    expect(app).toBeDefined();
  });

  describe('HealthCheck (e2e) /health-check', healthCheckTests);

  describe('User (e2e) /users', userTests);

  describe('Reef Pois (e2e) /pois', poiTests);

  describe('Collection (e2e) /collections', collectionTests);

  describe('Time Series (e2e) /time-series', timeSeriesTests);

  describe('Region (e2e) /regions', regionTests);

  describe('Reef Application {e2e) /reef-applications', reefApplicationTests);

  describe('Survey (e2e) /reefs/:id/surveys', surveyTests);

  describe('Reefs (e2e) /reefs', reefTests);

  describe('Sensors (e2e) /sensors', sensorTests);

  afterAll(async () => {
    await testService.cleanUpApp();
  });
});

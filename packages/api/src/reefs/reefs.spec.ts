import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { omit, sortBy } from 'lodash';
import { Connection } from 'typeorm';
import moment from 'moment';
import { TestService } from '../../test/test.service';
import {
  mockBackfillReefData,
  mockExtractAndVerifyToken,
  mockGetLiveData,
  mockGetMMM,
  mockGetSpotterData,
} from '../../test/utils';
import {
  adminFirebaseUserMock,
  defaultFirebaseUserMock,
  defaultUserMock,
  reefManagerUserMock,
} from '../../test/mock/user.mock';
import { createPoint } from '../utils/coordinates';
import { AdminLevel } from '../users/users.entity';
import { Reef, ReefStatus } from './reefs.entity';
import {
  athensReef,
  californiaReef,
  floridaReef,
} from '../../test/mock/reef.mock';
import { californiaDailyData } from '../../test/mock/daily-data.mock';

export const reefTests = () => {
  const testService = TestService.getInstance();
  let app: INestApplication;
  let connection: Connection;
  let reefId: number;
  const firstExclusionPeriod = {
    startDate: null,
    endDate: moment().subtract(8, 'days').endOf('day').toISOString(),
  };
  const secondExclusionPeriod = {
    startDate: moment().subtract(6, 'days').startOf('day').toISOString(),
    endDate: moment().subtract(4, 'days').endOf('day').toISOString(),
  };
  const reefDto = {
    reef: {
      name: 'India test reef',
      latitude: 14.6048471550538,
      longitude: 80.9669818291332,
      depth: 39,
    },
    reefApplication: {},
  };

  beforeAll(async () => {
    app = await testService.getApp();
    connection = await testService.getConnection();
  });

  it('POST / create a reef', async () => {
    mockBackfillReefData();
    mockExtractAndVerifyToken(defaultFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).post('/reefs').send(reefDto);

    expect(rsp.status).toBe(201);
    expect(rsp.body).toMatchObject({
      reef: {
        name: reefDto.reef.name,
        depth: reefDto.reef.depth,
        polygon: createPoint(reefDto.reef.longitude, reefDto.reef.latitude),
      },
      user: { id: defaultUserMock.id },
    });

    // user should have changed to reefManager
    mockExtractAndVerifyToken(defaultFirebaseUserMock);
    const rsp2 = await request(app.getHttpServer()).get('/users/current');

    expect(rsp2.status).toBe(200);
    expect(rsp2.body.adminLevel).toBe(AdminLevel.ReefManager);

    // Approve new reef
    await connection
      .getRepository(Reef)
      .update({ name: reefDto.reef.name }, { approved: true });
  });

  it('GET / find all reefs', async () => {
    const rsp = await request(app.getHttpServer()).get('/reefs');

    expect(rsp.status).toBe(200);
    expect(rsp.body.length).toBe(4);
    const sortedReefs = sortBy(rsp.body, 'createdAt');
    const testReef = sortedReefs[sortedReefs.length - 1];

    expect(testReef).toMatchObject({
      name: reefDto.reef.name,
      depth: reefDto.reef.depth,
      polygon: createPoint(reefDto.reef.longitude, reefDto.reef.latitude),
    });
    expect(testReef.id).toBeDefined();
    reefId = sortedReefs[sortedReefs.length - 1].id;
  });

  it('GET /:id retrieve one reef', async () => {
    const rsp = await request(app.getHttpServer()).get(`/reefs/${reefId}`);

    expect(rsp.status).toBe(200);
    expect(rsp.body).toMatchObject({
      name: reefDto.reef.name,
      depth: reefDto.reef.depth,
      polygon: createPoint(reefDto.reef.longitude, reefDto.reef.latitude),
    });
    expect(rsp.body.historicalMonthlyMean).toBeDefined();
    expect(rsp.body.historicalMonthlyMean.length).toBe(12);
  });

  it('GET /:id/daily_data', async () => {
    const rsp = await request(app.getHttpServer())
      .get(`/reefs/${californiaReef.id}/daily_data`)
      .query({
        start: moment().subtract(5, 'days').startOf('day').toISOString(),
        end: moment().endOf('day').toISOString(),
      });

    expect(rsp.status).toBe(200);
    expect(rsp.body.length).toBe(6);
    const data = californiaDailyData
      .slice(0, 6)
      .map((entry) => omit(entry, 'reef', 'updatedAt', 'createdAt'));
    expect(rsp.body).toMatchObject(data);
  });

  it('GET /:id/live_data', async () => {
    mockGetLiveData();
    const rsp = await request(app.getHttpServer()).get(
      `/reefs/${reefId}/live_data`,
    );

    expect(rsp.status).toBe(200);
  });

  it('PUT /:id update a reef', async () => {
    const updatedReefName = 'India reef';
    mockExtractAndVerifyToken(defaultFirebaseUserMock);
    const rsp = await request(app.getHttpServer())
      .put(`/reefs/${reefId}`)
      .send({
        name: updatedReefName,
      });

    expect(rsp.status).toBe(200);
    expect(rsp.body).toMatchObject({ name: updatedReefName });
  });

  it('PUT /:id update the admins of a reef', async () => {
    mockExtractAndVerifyToken(defaultFirebaseUserMock);
    const rsp = await request(app.getHttpServer())
      .put(`/reefs/${reefId}`)
      .send({
        adminIds: [defaultUserMock.id, reefManagerUserMock.id],
      });

    expect(rsp.status).toBe(200);
    expect(rsp.body.admins.length).toBe(2);
  });

  it('DELETE /:id delete a reef', async () => {
    mockExtractAndVerifyToken(defaultFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).delete(`/reefs/${reefId}`);

    expect(rsp.status).toBe(200);
  });

  describe('deploy a spotter', () => {
    it('POST /:id/deploy deploy spotter', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .post(`/reefs/${athensReef.id}/deploy`)
        .send({ endDate: firstExclusionPeriod.endDate });

      expect(rsp.status).toBe(201);
    });

    it('POST /:id/exclusion_dates add exclusion period', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .post(`/reefs/${athensReef.id}/exclusion_dates`)
        .send(secondExclusionPeriod);

      expect(rsp.status).toBe(201);
    });

    it('GET /:id/exclusion_dates', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).get(
        `/reefs/${athensReef.id}/exclusion_dates`,
      );

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(2);

      const sortedExclusionDates = sortBy(rsp.body, 'endDate');
      expect(sortedExclusionDates[0]).toMatchObject(firstExclusionPeriod);
      expect(sortedExclusionDates[1]).toMatchObject(secondExclusionPeriod);
    });

    it('GET /:id/spotter_data', async () => {
      mockGetSpotterData();
      const rsp = await request(app.getHttpServer())
        .get(`/reefs/${athensReef.id}/spotter_data`)
        .query({
          startDate: moment().subtract(9, 'days').startOf('day').toISOString(),
          endDate: moment().endOf('day').toISOString(),
        });

      expect(rsp.status).toBe(200);
      Object.keys(rsp.body).forEach((metric) => {
        expect(rsp.body[metric].length).toBe(4);
      });
    });
  });

  describe('Find reefs with filters', () => {
    it('GET / filter reefs by name', async () => {
      const rsp = await request(app.getHttpServer()).get('/reefs').query({
        name: floridaReef.name,
      });

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(1);

      expect(rsp.body[0]).toMatchObject(
        omit(floridaReef, 'createdAt', 'updatedAt'),
      );
    });

    it('GET / filter reefs by status', async () => {
      const rsp = await request(app.getHttpServer()).get('/reefs').query({
        status: ReefStatus.Deployed,
      });

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(2);

      const sortedReefs = sortBy(rsp.body, 'id');
      expect(sortedReefs[0]).toMatchObject(
        omit(californiaReef, 'applied', 'createdAt', 'updatedAt'),
      );
    });

    it('GET / filter reefs by regionId', async () => {
      const rsp = await request(app.getHttpServer()).get('/reefs').query({
        regionId: 0,
      });

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(0);
    });

    it('GET / filter reefs by spotter', async () => {
      const rsp = await request(app.getHttpServer()).get('/reefs').query({
        hasSpotter: true,
      });

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(2);
    });

    it('GET / filter reefs by adminId', async () => {
      const rsp = await request(app.getHttpServer()).get('/reefs').query({
        adminId: reefManagerUserMock.id,
      });

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(2);
    });
  });

  describe('test edge cases', () => {
    it('GET /:id retrieve a non-existing reef', async () => {
      const rsp = await request(app.getHttpServer()).get('/reefs/0');

      expect(rsp.status).toBe(404);
    });

    it('PUT /:id update a non-existing reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).put('/reefs/0');

      expect(rsp.status).toBe(404);
    });

    it('GET /:id/daily_data retrieve daily data from non-existing reef', async () => {
      const rsp = await request(app.getHttpServer())
        .get('/reefs/0/daily_data')
        .query({
          start: moment().subtract(1, 'days').toISOString(),
          end: moment().toISOString(),
        });

      expect(rsp.status).toBe(404);
    });

    it('GET /:id/daily_data retrieve daily data with invalid range', async () => {
      const rsp = await request(app.getHttpServer())
        .get(`/reefs/${athensReef.id}/daily_data`)
        .query({
          start: 'invalid date',
          end: '2020-10-10TInvalidDate',
        });

      expect(rsp.status).toBe(400);
    });

    it('GET /:id/live_data retrieve live data from non-existing reef', async () => {
      const rsp = await request(app.getHttpServer()).get('/reefs/0/live_data');

      expect(rsp.status).toBe(404);
    });

    it('GET /:id/spotter_data retrieve spotter data from non-existing reef', async () => {
      const rsp = await request(app.getHttpServer()).get(
        '/reefs/0/spotter_data',
      );

      expect(rsp.status).toBe(404);
    });

    it('GET /:id/spotter_data retrieve live data from a reef without a spotter', async () => {
      const rsp = await request(app.getHttpServer()).get(
        `/reefs/${floridaReef.id}/spotter_data`,
      );

      expect(rsp.status).toBe(404);
    });

    it('GET /:id/spotter_data retrieve spotter data with invalid date', async () => {
      const rsp = await request(app.getHttpServer())
        .get(`/reefs/${athensReef.id}/spotter_data`)
        .query({
          startDate: 'invalid date',
          endDate: '2020-10-10TInvalidDate',
        });

      expect(rsp.status).toBe(400);
    });

    it('POST /:id/deploy deploy the spotter of a non-existing reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).post('/reefs/0/deploy');

      expect(rsp.status).toBe(404);
    });

    it('POST /:id/deploy deploy the spotter of a reef without one', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).post(
        `/reefs/${floridaReef.id}/deploy`,
      );

      expect(rsp.status).toBe(400);
    });

    it('POST /:id/deploy re-deploy the spotter of a reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).post(
        `/reefs/${californiaReef.id}/deploy`,
      );

      expect(rsp.status).toBe(400);
    });

    it('POST /:id/exclusion_dates add exclusion dates to a non-existing reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .post('/reefs/0/exclusion_dates')
        .send({
          startDate: moment().subtract(1, 'days').toISOString(),
          endDate: moment().toISOString(),
        });

      expect(rsp.status).toBe(404);
    });

    it('POST /:id/exclusion_dates add exclusion dates to a reef with no spotter', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .post(`/reefs/${floridaReef.id}/exclusion_dates`)
        .send({
          startDate: moment().subtract(1, 'days').toISOString(),
          endDate: moment().toISOString(),
        });

      expect(rsp.status).toBe(400);
    });

    it('POST /:id/exclusion_dates add invalid exclusion dates to a reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .post(`/reefs/${californiaReef.id}/exclusion_dates`)
        .send({
          startDate: 'invalid date',
          endDate: '2020-10-10TInvalidDate',
        });

      expect(rsp.status).toBe(400);
    });

    it('PUT /:id update the admins of a reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .put(`/reefs/0`)
        .send({
          adminIds: [defaultUserMock.id, reefManagerUserMock.id],
        });

      expect(rsp.status).toBe(404);
    });

    it('GET /:id/exclusion_dates retrieve exclusion dates from a non-existing reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).get(
        '/reefs/0/exclusion_dates',
      );

      expect(rsp.status).toBe(404);
    });

    it('GET /:id/exclusion_dates retrieve exclusion dates from a non-existing reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).get(
        `/reefs/${floridaReef.id}/exclusion_dates`,
      );

      expect(rsp.status).toBe(400);
    });

    it('DELETE /:id delete a reef', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).delete('/reefs/0');

      expect(rsp.status).toBe(404);
    });
  });

  describe('test reef with no hmm', () => {
    it('POST / create a reef', async () => {
      mockBackfillReefData();
      mockGetMMM();
      mockExtractAndVerifyToken(defaultFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .post('/reefs')
        .send(reefDto);

      expect(rsp.status).toBe(201);
      expect(rsp.body).toMatchObject({
        reef: {
          name: reefDto.reef.name,
          depth: reefDto.reef.depth,
          polygon: createPoint(reefDto.reef.longitude, reefDto.reef.latitude),
        },
        user: { id: defaultUserMock.id },
      });

      reefId = rsp.body.reef.id;
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp2 = await request(app.getHttpServer()).delete(
        `/reefs/${reefId}`,
      );

      expect(rsp2.status).toBe(200);
    });
  });
};

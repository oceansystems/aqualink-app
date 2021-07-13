import { INestApplication } from '@nestjs/common';
import _, { maxBy, omit, sortBy } from 'lodash';
import request from 'supertest';
import { DeepPartial } from 'typeorm';
import {
  adminCollectionMock,
  defaultCollectionMock,
} from '../../test/mock/collection.mock';
import {
  athensReef,
  californiaReef,
  floridaReef,
} from '../../test/mock/reef.mock';
import {
  athensTimeSeries,
  californiaTimeSeries,
  floridaTimeSeries,
} from '../../test/mock/time-series.mock';
import {
  adminFirebaseUserMock,
  adminUserMock,
  defaultFirebaseUserMock,
  reefManagerFirebaseUserMock,
  reefManagerUserMock,
} from '../../test/mock/user.mock';
import { TestService } from '../../test/test.service';
import { mockExtractAndVerifyToken } from '../../test/utils';
import { Metric } from '../time-series/metrics.entity';
import { TimeSeries } from '../time-series/time-series.entity';
import { DEFAULT_COLLECTION_NAME } from '../utils/collections.utils';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

const collectionDtoToEntity = (dto: CreateCollectionDto) => ({
  name: dto.name,
  isPublic: dto.isPublic,
  user: { id: dto.userId },
  reefs: dto.reefIds.map((reefId) => ({ id: reefId })),
});

const getLatestData = (data: DeepPartial<TimeSeries>[]) =>
  _(data)
    .groupBy((o) => o.metric)
    .mapValues((o) => maxBy(o, (obj) => obj.timestamp)?.value)
    .toJSON();

export const collectionTests = () => {
  const testService = TestService.getInstance();
  let app: INestApplication;
  let createdCollectionId: number;
  let updateCollectionDto: UpdateCollectionDto;
  let createCollectionDto: CreateCollectionDto;

  beforeAll(async () => {
    app = await testService.getApp();
    createCollectionDto = {
      name: 'Test Dashboard',
      isPublic: true,
      userId: reefManagerUserMock.id || 0,
      reefIds: [floridaReef.id || 0, californiaReef.id || 0],
    };
    updateCollectionDto = {
      name: 'Updated Collection',
      isPublic: false,
      removeReefIds: [floridaReef.id || 0],
    };
  });

  describe('Test main collection flow', () => {
    it('POST / creates a new collection', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);

      const rsp = await request(app.getHttpServer())
        .post('/collections/')
        .send(createCollectionDto);

      expect(rsp.status).toBe(201);
      expect(rsp.body).toMatchObject(
        collectionDtoToEntity(createCollectionDto),
      );
      createdCollectionId = rsp.body.id;
    });

    it("GET / fetch all admin user's collections (no filters)", async () => {
      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);

      const rsp = await request(app.getHttpServer()).get('/collections/');

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(2);
      const sortedRsp = sortBy(rsp.body, (o) => o.createdAt);
      expect(sortedRsp[0]).toMatchObject({
        name: DEFAULT_COLLECTION_NAME,
        isPublic: false,
      });
      expect(sortedRsp[1]).toMatchObject({
        name: createCollectionDto.name,
        isPublic: createCollectionDto.isPublic,
      });
    });

    it('GET / filter collections by name', async () => {
      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .get('/collections/')
        .query({ name: createCollectionDto.name });

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(1);
      expect(rsp.body[0]).toMatchObject({
        name: createCollectionDto.name,
        isPublic: createCollectionDto.isPublic,
      });
    });

    it('GET / filter collections by reefId', async () => {
      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .get('/collections/')
        .query({ reefId: floridaReef.id });

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(2);
    });

    it('PUT /:id update the test collection', async () => {
      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .put(`/collections/${createdCollectionId}`)
        .send(updateCollectionDto);

      expect(rsp.status).toBe(200);
      expect(rsp.body.name).toBe(updateCollectionDto.name);
      expect(rsp.body.isPublic).toBe(updateCollectionDto.isPublic);
      expect(rsp.body.reefIds.length).toBe(1);
      expect(rsp.body.reefIds[0]).toBe(californiaReef.id);

      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);
      const rsp2 = await request(app.getHttpServer())
        .put(`/collections/${createdCollectionId}`)
        .send({
          addReefIds: [floridaReef || 0],
        });

      expect(rsp2.status).toBe(200);
      expect(rsp2.body.reefIds.length).toBe(2);
    });

    it('GET /public filter public collections', async () => {
      const rsp = await request(app.getHttpServer()).get('/collections/public');

      expect(rsp.status).toBe(200);
      // Only admin collection is public now
      expect(rsp.body.length).toBe(1);
    });

    it('GET /:id fetch collection details', async () => {
      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).get(
        `/collections/${createdCollectionId}`,
      );

      expect(rsp.status).toBe(200);
      expect(rsp.body.user).toMatchObject(
        omit(
          reefManagerUserMock,
          'adminLevel',
          'firebaseUid',
          'createdAt',
          'updatedAt',
        ),
      );
      expect(rsp.body.userId).toBe(reefManagerUserMock.id);
      expect(rsp.body.name).toBe(updateCollectionDto.name);
      expect(rsp.body.isPublic).toBe(updateCollectionDto.isPublic);
      expect(rsp.body.reefs.length).toBe(2);
      const sortedReefs = sortBy(rsp.body.reefs, (o) => o.name);
      expect(sortedReefs[0]).toMatchObject(
        omit(californiaReef, 'applied', 'createdAt', 'updatedAt'),
      );
      expect(sortedReefs[1]).toMatchObject(
        omit(floridaReef, 'applied', 'createdAt', 'updatedAt'),
      );

      const floridaLatestData = getLatestData(floridaTimeSeries);
      const californiaLatestData = getLatestData(californiaTimeSeries);

      expect(sortedReefs[0].collectionData).toStrictEqual(californiaLatestData);
      expect(sortedReefs[1].collectionData).toStrictEqual(floridaLatestData);
    });

    it('PUT /:id change the owner of the collection', async () => {
      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .put(`/collections/${createdCollectionId}`)
        .send({ userId: adminUserMock.id });

      expect(rsp.status).toBe(200);
    });

    it('DELETE /:id delete created test collection', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).delete(
        `/collections/${createdCollectionId}`,
      );

      expect(rsp.status).toBe(200);
    });
  });

  it('GET /public/:id fetch details from a public collection', async () => {
    const rsp = await request(app.getHttpServer()).get(
      `/collections/public/${adminCollectionMock.id}`,
    );

    expect(rsp.status).toBe(200);
    expect(rsp.body.user).toMatchObject(
      omit(adminUserMock, 'firebaseUid', 'createdAt', 'updatedAt'),
    );
    expect(rsp.body.userId).toBe(adminUserMock.id);
    expect(rsp.body.name).toBe(adminCollectionMock.name);
    expect(rsp.body.isPublic).toBe(adminCollectionMock.isPublic);
    expect(rsp.body.reefs.length).toBe(adminCollectionMock.reefs?.length);

    const sortedReefs = sortBy(rsp.body.reefs, (o) => o.name);
    expect(sortedReefs[0]).toMatchObject(
      omit(athensReef, 'applied', 'createdAt', 'updatedAt'),
    );
    expect(sortedReefs[1]).toMatchObject(
      omit(californiaReef, 'applied', 'createdAt', 'updatedAt'),
    );
    expect(sortedReefs[2]).toMatchObject(
      omit(floridaReef, 'applied', 'createdAt', 'updatedAt'),
    );

    const athensLatestData = getLatestData(athensTimeSeries);
    const californiaLatestData = getLatestData(californiaTimeSeries);
    const floridaLatestData = getLatestData(floridaTimeSeries);

    expect(sortedReefs[0].collectionData).toStrictEqual(
      // Omit top and bottom temperature since hobo data are not included in collection data
      omit(athensLatestData, Metric.TOP_TEMPERATURE, Metric.BOTTOM_TEMPERATURE),
    );
    expect(sortedReefs[1].collectionData).toStrictEqual(californiaLatestData);
    expect(sortedReefs[2].collectionData).toStrictEqual(floridaLatestData);
  });

  it('GET /:id access a collection that does not belong to you', async () => {
    mockExtractAndVerifyToken(reefManagerFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).get(
      `/collections/${adminCollectionMock.id}`,
    );

    expect(rsp.status).toBe(403);
  });

  it('GET /:id access a collection with no reefs', async () => {
    mockExtractAndVerifyToken(defaultFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).get(
      `/collections/${defaultCollectionMock.id}`,
    );

    expect(rsp.status).toBe(200);
    expect(rsp.body.reefs.length).toBe(0);
  });

  it('GET /public/:id access a non-public collection', async () => {
    const rsp = await request(app.getHttpServer()).get(
      `/collections/public/${defaultCollectionMock.id}`,
    );

    expect(rsp.status).toBe(403);
  });

  it('GET /public/:id fetch collection that does not exists', async () => {
    const rsp = await request(app.getHttpServer()).get(`/collections/public/0`);

    expect(rsp.status).toBe(404);
  });
};

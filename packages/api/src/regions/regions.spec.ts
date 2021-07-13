import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { sortBy } from 'lodash';
import { TestService } from '../../test/test.service';
import { createPoint } from '../utils/coordinates';
import { CreateRegionDto } from './dto/create-region.dto';
import { mockExtractAndVerifyToken } from '../../test/utils';
import { adminFirebaseUserMock } from '../../test/mock/user.mock';

const createParentRegionDto: CreateRegionDto = {
  name: 'Europe',
  polygon: createPoint(23.666694170726828, 37.92090950501416),
};

const createRegionDto: CreateRegionDto = {
  name: 'Greece',
  polygon: createPoint(24.666694170726828, 38.92090950501416),
};

export const regionTests = () => {
  const testService = TestService.getInstance();
  let app: INestApplication;
  let regionId: number;

  beforeAll(async () => {
    app = await testService.getApp();
  });

  it('POST / create a parent region', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer())
      .post('/regions')
      .send(createParentRegionDto);

    expect(rsp.status).toBe(201);
    expect(rsp.body).toMatchObject(createParentRegionDto);
    expect(rsp.body.id).toBeDefined();
    regionId = rsp.body.id;
  });

  it('POST / create a region', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer())
      .post('/regions')
      .send({ ...createRegionDto, parentId: regionId });

    expect(rsp.status).toBe(201);
    expect(rsp.body).toMatchObject(createRegionDto);
  });

  it('GET / fetch regions', async () => {
    const rsp = await request(app.getHttpServer()).get('/regions');

    expect(rsp.status).toBe(200);
    expect(rsp.body.length).toBe(2);
    const sortedRegions = sortBy(rsp.body, 'name');
    expect(sortedRegions[0]).toMatchObject(createParentRegionDto);
  });

  it('GET / fetch regions with filters', async () => {
    const rsp = await request(app.getHttpServer()).get('/regions').query({
      name: createRegionDto.name,
      parent: regionId,
    });

    expect(rsp.status).toBe(200);
    expect(rsp.body.length).toBe(1);
    expect(rsp.body[0]).toMatchObject(createRegionDto);
  });

  it('GET /:id fetch a specific region', async () => {
    const rsp = await request(app.getHttpServer()).get(`/regions/${regionId}`);

    expect(rsp.status).toBe(200);
    expect(rsp.body).toMatchObject(createParentRegionDto);
  });

  it('PUT /:id update region', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const updatedRegionName = 'Updated Region';
    const rsp = await request(app.getHttpServer())
      .put(`/regions/${regionId}`)
      .send({
        name: updatedRegionName,
      });

    expect(rsp.status).toBe(200);
    expect(rsp.body.name).toBe(updatedRegionName);
  });

  it('DELETE /:id delete regions', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).delete(
      `/regions/${regionId}`,
    );

    expect(rsp.status).toBe(200);
  });

  it('GET /:id fetch non-existing region', async () => {
    const rsp = await request(app.getHttpServer()).get('/regions/0');

    expect(rsp.status).toBe(404);
  });

  it('PUT /:id update non-existing region', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const updatedRegionName = 'Updated Region';
    const rsp = await request(app.getHttpServer()).put('/regions/0').send({
      name: updatedRegionName,
    });

    expect(rsp.status).toBe(404);
  });

  it('DELETE /:id delete non-existing region', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).delete('/regions/0');

    expect(rsp.status).toBe(404);
  });
};

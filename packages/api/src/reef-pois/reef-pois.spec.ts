import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { omit } from 'lodash';
import { TestService } from '../../test/test.service';
import { CreateReefPoiDto } from './dto/create-reef-poi.dto';
import { athensReef } from '../../test/mock/reef.mock';
import { createPoint } from '../utils/coordinates';
import { mockExtractAndVerifyToken } from '../../test/utils';
import { adminFirebaseUserMock } from '../../test/mock/user.mock';

export const poiTests = () => {
  const testService = TestService.getInstance();
  let app: INestApplication;
  let createPoiDto: CreateReefPoiDto;
  let createPoiWithoutLocationDto: CreateReefPoiDto;
  let poiId: number;
  let poiWithoutLocationId: number;

  beforeAll(async () => {
    app = await testService.getApp();
    createPoiDto = {
      name: 'Salamina',
      reefId: athensReef.id || 0,
      imageUrl: 'http://some-sample-url.com',
      latitude: 37.95813968719644,
      longitude: 23.478834700473044,
    };

    createPoiWithoutLocationDto = {
      name: 'Atlantis',
      reefId: athensReef.id || 0,
      imageUrl: 'http://some-sample-url.com',
    };
  });

  it('POST / create a poi', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer())
      .post('/pois')
      .send(createPoiDto);

    expect(rsp.status).toBe(201);
    expect(rsp.body).toMatchObject({
      ...omit(createPoiDto, 'latitude', 'longitude'),
      polygon: createPoint(createPoiDto.longitude!, createPoiDto.latitude!),
    });
    expect(rsp.body.id).toBeDefined();
    poiId = rsp.body.id;
  });

  it('POST / create a poi without a location', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer())
      .post('/pois')
      .send(createPoiWithoutLocationDto);

    expect(rsp.status).toBe(201);
    expect(rsp.body).toMatchObject(createPoiWithoutLocationDto);
    expect(rsp.body.id).toBeDefined();
    poiWithoutLocationId = rsp.body.id;
  });

  it('GET / fetch pois', async () => {
    const rsp = await request(app.getHttpServer()).get('/pois');

    expect(rsp.status).toBe(200);
    expect(rsp.body.length).toBe(6);
  });

  it('GET / fetch pois with filters', async () => {
    const rsp = await request(app.getHttpServer()).get('/pois').query({
      name: createPoiDto.name,
      reefId: createPoiDto.reefId,
    });

    expect(rsp.status).toBe(200);
    expect(rsp.body.length).toBe(1);
    expect(rsp.body[0]).toMatchObject({
      ...omit(createPoiDto, 'latitude', 'longitude'),
      polygon: createPoint(createPoiDto.longitude!, createPoiDto.latitude!),
    });
  });

  it('GET /:id fetch a poi', async () => {
    const rsp = await request(app.getHttpServer()).get(`/pois/${poiId}`);

    expect(rsp.status).toBe(200);
    expect(rsp.body).toMatchObject({
      ...omit(createPoiDto, 'latitude', 'longitude'),
      polygon: createPoint(createPoiDto.longitude!, createPoiDto.latitude!),
    });
  });

  it('PUT /:id update a poi', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const updatedName = 'Updated poi name';
    const nameRsp = await request(app.getHttpServer())
      .put(`/pois/${poiId}`)
      .send({
        name: updatedName,
      });

    expect(nameRsp.status).toBe(200);
    expect(nameRsp.body.name).toBe(updatedName);

    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const coordinates = [37.94717566570979, 23.478505804426504];
    const polygonRsp = await request(app.getHttpServer())
      .put(`/pois/${poiId}`)
      .send({
        latitude: coordinates[0],
        longitude: coordinates[1],
      });

    expect(polygonRsp.status).toBe(200);
    expect(polygonRsp.body.polygon).toStrictEqual(
      createPoint(coordinates[1], coordinates[0]),
    );
  });

  it('DELETE /:id delete a poi', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).delete(`/pois/${poiId}`);

    expect(rsp.status).toBe(200);
  });

  it('DELETE /:id delete another poi', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).delete(
      `/pois/${poiWithoutLocationId}`,
    );

    expect(rsp.status).toBe(200);
  });

  it('GET /:id fetch non-existing poi', async () => {
    const rsp = await request(app.getHttpServer()).get('/pois/0');

    expect(rsp.status).toBe(404);
  });

  it('PUT /:id update non-existing poi', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const update = 'Updated Poi';
    const rsp = await request(app.getHttpServer()).put('/pois/0').send({
      name: update,
    });

    expect(rsp.status).toBe(404);
  });

  it('DELETE /:id delete non-existing poi', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).delete('/pois/0');

    expect(rsp.status).toBe(404);
  });
};

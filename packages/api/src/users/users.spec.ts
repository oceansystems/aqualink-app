import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { GeoJSON } from 'geojson';
import { DeepPartial } from 'typeorm';
import { omit } from 'lodash';
import { TestService } from '../../test/test.service';
import { AdminLevel, User } from './users.entity';
import {
  adminFirebaseUserMock,
  adminUserMock,
  reefManagerFirebaseUserMock,
  reefManagerUserMock,
  testFirebaseUserMock,
  testUserMock,
} from '../../test/mock/user.mock';
import { mockExtractAndVerifyToken } from '../../test/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { californiaReef, floridaReef } from '../../test/mock/reef.mock';

const createUserDto = (mockUser: DeepPartial<User>): CreateUserDto => ({
  fullName: mockUser.fullName,
  email: mockUser.email as string,
  organization: mockUser.organization,
  country: mockUser.country,
  description: mockUser.description,
  imageUrl: mockUser.imageUrl,
  location: mockUser.location as GeoJSON,
});

export const userTests = () => {
  const testService = TestService.getInstance();
  let app: INestApplication;

  const testUserDto = createUserDto(testUserMock);
  const reefManagerUserDto = createUserDto(reefManagerUserMock);

  beforeAll(async () => {
    app = await testService.getApp();
  });

  it('GET /current gets admin user.', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).get('/users/current');

    expect(rsp.status).toBe(200);
    expect(rsp.body).not.toHaveProperty('firebaseUid');
    expect(rsp.body).toMatchObject({
      ...omit(adminUserMock, 'firebaseUid', 'updatedAt', 'createdAt'),
    });
    expect(rsp.body).toHaveProperty('id');
    expect(rsp.body).toHaveProperty('createdAt');
    expect(rsp.body).toHaveProperty('updatedAt');
  });

  it('GET /current tries unauthorized call.', async () => {
    const rsp = await request(app.getHttpServer()).get('/users/current');

    expect(rsp.status).toBe(401);
  });

  describe('Create a dummy user.', () => {
    let testUserId = 0;

    it('POST / creates a user.', async () => {
      mockExtractAndVerifyToken(testFirebaseUserMock);

      const rsp = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...testUserDto,
          // Test that email is converted to lower case on registration
          email: testUserDto.email.toUpperCase(),
        });

      expect(rsp.status).toBe(201);
      expect(rsp.body).toHaveProperty('id');
      expect(rsp.body.email).toBe(testUserMock.email);

      testUserId = rsp.body.id;
    });

    it('PUT /:id/level changes the level of test user.', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer())
        .put(`/users/${testUserId}/level`)
        .send({
          level: AdminLevel.ReefManager,
        });

      expect(rsp.status).toBe(200);
    });

    it('GET /current tests level change.', async () => {
      mockExtractAndVerifyToken(testFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).get('/users/current');

      expect(rsp.status).toBe(200);
      expect(rsp.body.adminLevel).toBe(AdminLevel.ReefManager);
    });

    it('DELETE /:id deletes test user.', async () => {
      mockExtractAndVerifyToken(adminFirebaseUserMock);
      const rsp = await request(app.getHttpServer()).delete(
        `/users/${testUserId}`,
      );

      expect(rsp.status).toBe(200);
    });
  });

  describe('Creates a user for an existing reef manager.', () => {
    it('POST / creates a user.', async () => {
      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);

      const rsp = await request(app.getHttpServer())
        .post('/users')
        .send(reefManagerUserDto);

      expect(rsp.status).toBe(201);
      expect(rsp.body.adminLevel).toBe(AdminLevel.ReefManager);
    });

    it('GET /current/administered-reefs Gets administered reefs of user.', async () => {
      mockExtractAndVerifyToken(reefManagerFirebaseUserMock);

      const rsp = await request(app.getHttpServer()).get(
        '/users/current/administered-reefs',
      );

      expect(rsp.status).toBe(200);
      expect(rsp.body.length).toBe(2);
      expect(rsp.body[0]).toMatchObject({
        ...omit(californiaReef, 'updatedAt', 'createdAt'),
      });
      expect(rsp.body[1]).toMatchObject({
        ...omit(floridaReef, 'updatedAt', 'createdAt'),
      });
    });
  });

  it('POST / with an invalid token.', async () => {
    mockExtractAndVerifyToken(undefined);

    const rsp = await request(app.getHttpServer())
      .post('/users')
      .send(testUserDto);

    expect(rsp.status).toBe(400);
  });

  it('POST / with an mismatching email.', async () => {
    mockExtractAndVerifyToken({
      ...testFirebaseUserMock,
      email: 'random@email.com',
    });

    const rsp = await request(app.getHttpServer())
      .post('/users')
      .send(testUserDto);

    expect(rsp.status).toBe(400);
  });

  it('POST / creates a user with an existing uid.', async () => {
    mockExtractAndVerifyToken({
      ...testFirebaseUserMock,
      uid: adminFirebaseUserMock.uid,
    });

    const rsp = await request(app.getHttpServer())
      .post('/users')
      .send(testUserDto);

    expect(rsp.status).toBe(400);
  });

  it('POST / creates a user with an existing email.', async () => {
    mockExtractAndVerifyToken({
      ...adminFirebaseUserMock,
      uid: testFirebaseUserMock.uid,
    });

    const rsp = await request(app.getHttpServer())
      .post('/users')
      .send({
        ...testUserDto,
        email: adminUserMock.email,
      });

    expect(rsp.status).toBe(400);
  });

  it('PUT /:id/level tries to change level to an non-existing user.', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);

    const rsp = await request(app.getHttpServer()).put(`/users/0/level`).send({
      level: AdminLevel.ReefManager,
    });

    expect(rsp.status).toBe(404);
  });

  it('DELETE /:id deletes test user.', async () => {
    mockExtractAndVerifyToken(adminFirebaseUserMock);
    const rsp = await request(app.getHttpServer()).delete(`/users/0`);

    expect(rsp.status).toBe(404);
  });
};

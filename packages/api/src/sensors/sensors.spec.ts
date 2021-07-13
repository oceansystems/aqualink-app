import { INestApplication } from '@nestjs/common';
import moment from 'moment';
import request from 'supertest';
import { californiaReef } from '../../test/mock/reef.mock';
import {
  hoboMetrics,
  NOAAMetrics,
  spotterMetrics,
} from '../../test/mock/time-series.mock';
import { TestService } from '../../test/test.service';
import { SourceType } from '../reefs/schemas/source-type.enum';
import { Metric } from '../time-series/metrics.entity';

export const sensorTests = () => {
  const testService = TestService.getInstance();
  let app: INestApplication;

  beforeAll(async () => {
    app = await testService.getApp();
  });

  it('GET / retrieve reefs with sensors', async () => {
    const rsp = await request(app.getHttpServer()).get('/sensors');

    expect(rsp.status).toBe(200);
    expect(rsp.body.length).toBe(2);
  });

  it('GET /:id/data fetch sensor data', async () => {
    const rsp = await request(app.getHttpServer())
      .get(`/sensors/${californiaReef.sensorId}/data`)
      .query({
        startDate: moment().subtract(5, 'days').startOf('day').toISOString(),
        endDate: moment().endOf('day').toISOString(),
        metrics: Metric.TOP_TEMPERATURE,
      });

    expect(rsp.status).toBe(200);
    const sources = [SourceType.HOBO, SourceType.NOAA, SourceType.SPOTTER];
    sources.forEach((source) => {
      expect(rsp.body).toHaveProperty(source);
    });
    hoboMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.HOBO]).toHaveProperty(metric);
      expect(rsp.body[SourceType.HOBO][metric].length).toBe(0);
    });
    NOAAMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.NOAA]).toHaveProperty(metric);
      expect(rsp.body[SourceType.NOAA][metric].length).toBe(0);
    });
    spotterMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.SPOTTER]).toHaveProperty(metric);
    });
    expect(rsp.body[SourceType.SPOTTER][Metric.TOP_TEMPERATURE].length).toBe(6);
  });

  it('GET /:id/surveys fetch sensor surveys', async () => {
    const rsp = await request(app.getHttpServer()).get(
      `/sensors/${californiaReef.sensorId}/surveys`,
    );

    expect(rsp.status).toBe(200);
    expect(rsp.body.length).toBe(2);
  });

  it('GET /:id/data fetch sensor data with invalid metric', async () => {
    const rsp = await request(app.getHttpServer())
      .get(`/sensors/${californiaReef.sensorId}/data`)
      .query({
        startDate: moment().subtract(5, 'days').startOf('day').toISOString(),
        endDate: moment().endOf('day').toISOString(),
        metrics: 'invalidMetric',
      });

    expect(rsp.status).toBe(400);
  });
};

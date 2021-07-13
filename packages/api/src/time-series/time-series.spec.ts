import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { max, min } from 'lodash';
import moment from 'moment';
import { TestService } from '../../test/test.service';
import { athensReef, californiaReef } from '../../test/mock/reef.mock';
import { athensPoiPiraeus } from '../../test/mock/poi.mock';
import { SourceType } from '../reefs/schemas/source-type.enum';
import {
  hoboMetrics,
  NOAAMetrics,
  spotterMetrics,
} from '../../test/mock/time-series.mock';

type StringDateRange = [string, string];

export const timeSeriesTests = () => {
  const testService = TestService.getInstance();
  let app: INestApplication;
  let poiDataRange: StringDateRange = [
    new Date().toISOString(),
    new Date(0).toISOString(),
  ];
  let reefDataRange: StringDateRange = [
    new Date().toISOString(),
    new Date(0).toISOString(),
  ];

  beforeAll(async () => {
    app = await testService.getApp();
  });

  it('GET /reefs/:reefId/pois/:poiId/range fetch range of poi data', async () => {
    const rsp = await request(app.getHttpServer()).get(
      `/time-series/reefs/${athensReef.id}/pois/${athensPoiPiraeus.id}/range`,
    );

    expect(rsp.status).toBe(200);
    const sources = [SourceType.HOBO, SourceType.NOAA, SourceType.SPOTTER];
    sources.forEach((source) => {
      expect(rsp.body).toHaveProperty(source);
    });
    hoboMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.HOBO]).toHaveProperty(metric);
      expect(rsp.body[SourceType.HOBO][metric].length).toBe(1);
      const { minDate, maxDate } = rsp.body[SourceType.HOBO][metric][0];
      const [startDate, endDate] = poiDataRange;
      poiDataRange = [min([minDate, startDate]), max([maxDate, endDate])];
    });
    NOAAMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.NOAA]).toHaveProperty(metric);
      expect(rsp.body[SourceType.NOAA][metric].length).toBe(1);
      const { minDate, maxDate } = rsp.body[SourceType.NOAA][metric][0];
      const [startDate, endDate] = poiDataRange;
      poiDataRange = [min([minDate, startDate]), max([maxDate, endDate])];
    });
    spotterMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.SPOTTER]).toHaveProperty(metric);
      expect(rsp.body[SourceType.SPOTTER][metric].length).toBe(0);
    });
  });

  it('GET /reefs/:id/range fetch range of reef data', async () => {
    const rsp = await request(app.getHttpServer()).get(
      `/time-series/reefs/${californiaReef.id}/range`,
    );

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
      expect(rsp.body[SourceType.NOAA][metric].length).toBe(1);
      const { minDate, maxDate } = rsp.body[SourceType.NOAA][metric][0];
      const [startDate, endDate] = reefDataRange;
      reefDataRange = [min([minDate, startDate]), max([maxDate, endDate])];
    });
    spotterMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.SPOTTER]).toHaveProperty(metric);
      expect(rsp.body[SourceType.SPOTTER][metric].length).toBe(1);
      const { minDate, maxDate } = rsp.body[SourceType.SPOTTER][metric][0];
      const [startDate, endDate] = reefDataRange;
      reefDataRange = [min([minDate, startDate]), max([maxDate, endDate])];
    });
  });

  it('GET /reefs/:reefId/pois/:poiId fetch poi data', async () => {
    const [startDate, endDate] = poiDataRange;
    const rsp = await request(app.getHttpServer())
      .get(`/time-series/reefs/${athensReef.id}/pois/${athensPoiPiraeus.id}`)
      .query({
        // Increase the search window to combat precision issues with the dates
        start: moment(startDate).subtract(1, 'minute').toISOString(),
        end: moment(endDate).add(1, 'minute').toISOString(),
        metrics: hoboMetrics.concat(NOAAMetrics),
        hourly: false,
      });

    expect(rsp.status).toBe(200);
    const sources = [SourceType.HOBO, SourceType.NOAA, SourceType.SPOTTER];
    sources.forEach((source) => {
      expect(rsp.body).toHaveProperty(source);
    });
    hoboMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.HOBO]).toHaveProperty(metric);
      expect(rsp.body[SourceType.HOBO][metric].length).toBe(10);
    });
    NOAAMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.NOAA]).toHaveProperty(metric);
      expect(rsp.body[SourceType.NOAA][metric].length).toBe(10);
    });
    spotterMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.SPOTTER]).toHaveProperty(metric);
      expect(rsp.body[SourceType.SPOTTER][metric].length).toBe(0);
    });
  });

  it('GET /reefs/:reefId/pois/:poiId fetch reef data', async () => {
    const [startDate, endDate] = reefDataRange;
    const rsp = await request(app.getHttpServer())
      .get(`/time-series/reefs/${californiaReef.id}`)
      .query({
        // Increase the search window to combat precision issues with the dates
        start: moment(startDate).subtract(1, 'minute').toISOString(),
        end: moment(endDate).add(1, 'minute').toISOString(),
        metrics: spotterMetrics.concat(NOAAMetrics),
        hourly: false,
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
      expect(rsp.body[SourceType.NOAA][metric].length).toBe(10);
    });
    spotterMetrics.forEach((metric) => {
      expect(rsp.body[SourceType.SPOTTER]).toHaveProperty(metric);
      expect(rsp.body[SourceType.SPOTTER][metric].length).toBe(10);
    });
  });
};

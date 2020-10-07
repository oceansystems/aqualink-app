import { getDailyData } from './dailyData';
import { Reef } from '../reefs/reefs.entity';

test('It processes Sofar API for daily data.', async () => {
  jest.setTimeout(60000);

  const date = new Date('2020-09-01');
  date.setUTCHours(0, 0, 0, 0);
  const reef = {
    id: 1,
    name: null,
    polygon: {
      type: 'Polygon',
      coordinates: [-122.699036598, 37.893756314],
    },
    spotterId: 'SPOT-300434063450120',
    temperatureThreshold: null,
    depth: null,
    maxMonthlyMean: 22,
    status: 0,
    videoStream: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    timezone: 'Etc/GMT+12',
  };

  const values = await getDailyData((reef as unknown) as Reef, date);

  expect(values).toEqual({
    reef: { id: 1 },
    date,
    minBottomTemperature: 14.880000000000003,
    maxBottomTemperature: 15.96,
    avgBottomTemperature: 15.255138888888885,
    surfaceTemperature: 15.596250000000001,
    satelliteTemperature: 15.5299997329712,
    degreeHeatingDays: 33.879997730255106,
    minWaveHeight: 0.41,
    maxWaveHeight: 0.58,
    avgWaveHeight: 0.47625000000000006,
    waveDirection: 166,
    wavePeriod: 14,
    minWindSpeed: 1.03203940391541,
    maxWindSpeed: 3.85278034210205,
    avgWindSpeed: 2.231244638562202,
    windDirection: 37,
    dailyAlertLevel: 0,
  });
});

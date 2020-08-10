import { getSofarDailyData } from './sofar';

test('It processes Sofar API for daily data.', async () => {
  jest.setTimeout(30000);
  const values = await getSofarDailyData(
    'HYCOM',
    'HYCOM-seaSurfaceTemperature',
    -3.5976336810301888,
    -178.0000002552476,
    'Etc/GMT+12',
    new Date('2020-07-07'),
  );

  expect(values).toEqual([
    { timestamp: '2020-07-06T12:00:00.000Z', value: 29.3450012207031 },
    { timestamp: '2020-07-06T15:00:00.000Z', value: 29.4020004272461 },
    { timestamp: '2020-07-06T18:00:00.000Z', value: 29.3900012969971 },
    { timestamp: '2020-07-06T21:00:00.000Z', value: 29.3250007629395 },
    { timestamp: '2020-07-07T00:00:00.000Z', value: 29.4540004730225 },
    { timestamp: '2020-07-07T03:00:00.000Z', value: 29.4799995422363 },
    { timestamp: '2020-07-07T06:00:00.000Z', value: 29.4029998779297 },
    { timestamp: '2020-07-07T09:00:00.000Z', value: 29.423999786377 },
  ]);
});

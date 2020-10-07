import { SofarModels, sofarVariableIDs } from './constants';
import { getSofarHindcastData, getSpotterData, sofarForecast } from './sofar';

test('It processes Sofar API for daily data.', async () => {
  jest.setTimeout(30000);
  const values = await getSofarHindcastData(
    'HYCOM',
    'HYCOM-seaSurfaceTemperature',
    -3.5976336810301888,
    -178.0000002552476,
    new Date('2020-07-07'),
  );

  expect(values).toEqual([
    { timestamp: '2020-07-06T00:00:00.000Z', value: 29.6140003204346 },
    { timestamp: '2020-07-06T03:00:00.000Z', value: 29.6389999389648 },
    { timestamp: '2020-07-06T06:00:00.000Z', value: 29.5740013122559 },
    { timestamp: '2020-07-06T09:00:00.000Z', value: 29.5670013427734 },
    { timestamp: '2020-07-06T12:00:00.000Z', value: 29.3450012207031 },
    { timestamp: '2020-07-06T15:00:00.000Z', value: 29.4020004272461 },
    { timestamp: '2020-07-06T18:00:00.000Z', value: 29.3900012969971 },
    { timestamp: '2020-07-06T21:00:00.000Z', value: 29.3250007629395 },
  ]);
});

test('It processes Sofar Spotter API for daily data.', async () => {
  jest.setTimeout(30000);
  const values = await getSpotterData(
    'SPOT-300434063450120',
    new Date('2020-09-02'),
  );

  expect(values.bottomTemperature.length).toEqual(144);
  expect(values.surfaceTemperature.length).toEqual(144);
});

test('it process Sofar Forecast API for live data', async () => {
  jest.setTimeout(30000);
  const now = new Date();
  const values = await sofarForecast(
    SofarModels.GFS,
    sofarVariableIDs[SofarModels.GFS].magnitude10MeterWind,
    -3.5976336810301888,
    -178.0000002552476,
  );

  expect(new Date(values.timestamp).getTime()).toBeLessThanOrEqual(
    now.getTime(),
  );
});

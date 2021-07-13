import {
  calculateDegreeHeatingDays,
  getMMM,
  getHistoricalMonthlyMeans,
} from './temperature';

// Mock functions
function getSeaSurfaceTemperatures(reefID: number) {
  return Array.from(Array(reefID), (_, index) => index);
}

function getMaximumMonthlyMean(reefID: number) {
  return 27.5 + reefID;
}

test('Not enough SST.', () => {
  const seaSurfaceTemperatures = getSeaSurfaceTemperatures(1);
  const maximumMonthlyMean = getMaximumMonthlyMean(1);
  return expect(() => {
    calculateDegreeHeatingDays(seaSurfaceTemperatures, maximumMonthlyMean);
  }).toThrow(Error);
});

test('Undefined maximumMonthlyMean', () => {
  const seaSurfaceTemperatures = getSeaSurfaceTemperatures(84);
  return expect(() => {
    calculateDegreeHeatingDays(seaSurfaceTemperatures, undefined);
  }).toThrow(Error);
});

test('Calculates data as expected.', () => {
  const seaSurfaceTemperatures = getSeaSurfaceTemperatures(84);
  const maximumMonthlyMean = getMaximumMonthlyMean(1);
  const DHD = calculateDegreeHeatingDays(
    seaSurfaceTemperatures,
    maximumMonthlyMean,
  );
  expect(DHD).toBe(1512);
});

test('Get MMM as expected.', async () => {
  jest.setTimeout(60000);
  await getMMM(0, 0).then((data) => expect(data).toEqual(28.95));
  await getMMM(-89.9, -10).then((data) => expect(data).toEqual(26.55));
  await getMMM(-108.0, -53.1).then((data) => expect(data).toEqual(7.94));
});

test('Get HistoricalMonthlyMeans as expected.', async () => {
  jest.setTimeout(60000);
  await getHistoricalMonthlyMeans(0, 0).then((data) =>
    expect(data).toEqual([
      { month: 1, temperature: 27.65 },
      { month: 2, temperature: 28.24 },
      { month: 3, temperature: 28.68 },
      { month: 4, temperature: 28.95 },
      { month: 5, temperature: 28.06 },
      { month: 6, temperature: 25.83 },
      { month: 7, temperature: 25.06 },
      { month: 8, temperature: 24.82 },
      { month: 9, temperature: 25.44 },
      { month: 10, temperature: 26.25 },
      { month: 11, temperature: 26.7 },
      { month: 12, temperature: 27.03 },
    ]),
  );
});

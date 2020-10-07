import { calculateDegreeHeatingDays, getMMM } from './temperature';

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

import { sum } from 'lodash';

export const getAverage = (numbers: number[], round = false) => {
  if (numbers.length === 0) {
    return undefined;
  }
  const average = sum(numbers) / numbers.length;
  return round ? Math.round(average) : average;
};

export const getMin = (numbers: number[]) => {
  return numbers.length > 0 ? Math.min(...numbers) : undefined;
};

export const getMax = (numbers: number[]) => {
  return numbers.length > 0 ? Math.max(...numbers) : undefined;
};

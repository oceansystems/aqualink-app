/* eslint-disable no-param-reassign, fp/no-mutation */
import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { DailyData } from '../reefs/daily-data.entity';

define(DailyData, (faker: typeof Faker) => {
  const dailyData = new DailyData();
  dailyData.date = faker.date.past(1);

  const avgBottomTemperature = faker.random.number({ min: 20, max: 40 });
  dailyData.minBottomTemperature = avgBottomTemperature - 1;
  dailyData.maxBottomTemperature = avgBottomTemperature + 1;
  dailyData.avgBottomTemperature = avgBottomTemperature;

  dailyData.degreeHeatingDays = faker.random.number({ min: 20, max: 40 });
  dailyData.surfaceTemperature = faker.random.number({ min: 20, max: 40 });
  dailyData.satelliteTemperature = faker.random.number({ min: 20, max: 40 });

  const avgWaveHeight = faker.random.number({ min: 2, max: 4 });
  dailyData.minWaveHeight = avgWaveHeight - 1;
  dailyData.maxWaveHeight = avgWaveHeight + 1;
  dailyData.avgWaveHeight = avgWaveHeight;
  dailyData.waveDirection = faker.random.number({ min: 0, max: 360 });
  dailyData.wavePeriod = faker.random.number({ min: 10, max: 30 });

  const avgWindSpeed = faker.random.number({ min: 2, max: 4 });
  dailyData.minWindSpeed = avgWindSpeed - 1;
  dailyData.maxWindSpeed = avgWindSpeed + 1;
  dailyData.avgWindSpeed = avgWindSpeed;
  dailyData.windDirection = faker.random.number({ min: 0, max: 360 });

  return dailyData;
});

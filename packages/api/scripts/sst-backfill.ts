import { createConnection, In } from 'typeorm';
import Bluebird from 'bluebird';
import { Point } from 'geojson';
import { keyBy } from 'lodash';
import { Reef } from '../src/reefs/reefs.entity';
import { getNOAAData } from './utils/netcdf';
import { DailyData } from '../src/reefs/daily-data.entity';
import { Sources } from '../src/reefs/sources.entity';
import {
  getNOAASource,
  insertReefDataToTimeSeries,
} from '../src/utils/time-series.utils';
import { TimeSeries } from '../src/time-series/time-series.entity';
import { Metric } from '../src/time-series/metrics.entity';

const dbConfig = require('../ormconfig');

// Reefs and years to backfill SST for
const yearsArray = [2017, 2018, 2019, 2020];
const reefsToProcess: number[] = [497];

async function main() {
  const connection = await createConnection(dbConfig);
  const reefRepository = connection.getRepository(Reef);
  const dailyDataRepository = connection.getRepository(DailyData);
  const sourcesRepository = connection.getRepository(Sources);
  const timeSeriesRepository = connection.getRepository(TimeSeries);
  const selectedReefs = await reefRepository.find({
    where:
      reefsToProcess.length > 0
        ? {
            id: In(reefsToProcess),
          }
        : {},
  });

  const dailyDataEntities = selectedReefs.reduce(
    (entities: DailyData[], reef) => {
      console.log(`Processing reef ${reef.name || reef.id}...`);
      const allYearEntities = yearsArray.reduce(
        (yearEntities: DailyData[], year) => {
          console.log(`Processing year ${year}...`);
          const [longitude, latitude] = (reef.polygon as Point).coordinates;
          const data = getNOAAData(year, longitude, latitude);
          const yearEntitiesForReef = data.map(
            ({ date, satelliteTemperature }) =>
              ({
                reef: { id: reef.id },
                date,
                satelliteTemperature,
              } as DailyData),
          );
          return yearEntities.concat(yearEntitiesForReef);
        },
        [],
      );
      return entities.concat(allYearEntities);
    },
    [],
  );

  const sources = await Promise.all(
    selectedReefs.map((reef) => {
      return getNOAASource(reef, sourcesRepository);
    }),
  );

  const reefToSource: Record<number, Sources> = keyBy(
    sources,
    (source) => source.reef.id,
  );

  await Bluebird.map(dailyDataEntities, async (entity) => {
    try {
      await dailyDataRepository.save(entity);
    } catch (err) {
      if (err.constraint === 'no_duplicated_date') {
        console.debug(
          `Data already exists for this date ${entity.date.toDateString()}`,
        );
      } else {
        console.error(err);
      }
    }

    if (!entity.satelliteTemperature) {
      return;
    }

    await insertReefDataToTimeSeries(
      [
        {
          value: entity.satelliteTemperature,
          timestamp: entity.date.toISOString(),
        },
      ],
      Metric.SATELLITE_TEMPERATURE,
      reefToSource[entity.reef.id],
      timeSeriesRepository,
    );
  });

  // Update materialized view
  console.log('Refreshing materialized view latest_data');
  await connection.query('REFRESH MATERIALIZED VIEW latest_data');

  connection.close();
  process.exit(0);
}

main();

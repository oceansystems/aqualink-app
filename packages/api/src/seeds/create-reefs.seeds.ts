import { Factory, Seeder } from 'typeorm-seeding';
import { times } from 'lodash';
import { Reef } from '../reefs/reefs.entity';
import { DailyData } from '../reefs/daily-data.entity';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';
import { TimeSeries } from '../time-series/time-series.entity';
import { Metric } from '../time-series/metrics.entity';
import { Sources } from '../reefs/sources.entity';
import { SourceType } from '../reefs/schemas/source-type.enum';

export class CreateReef implements Seeder {
  public async run(factory: Factory) {
    const reef = await factory(Reef)().create();

    const startDate = new Date(2020, 1, 1);
    const dates = times(10, (i) => {
      const date = new Date();
      date.setDate(startDate.getDate() + i);
      return date;
    });

    await Promise.all(
      dates.map((date) => {
        return factory(DailyData)()
          .map(async (dailyData) => {
            dailyData.date = date;
            dailyData.reef = reef;
            return dailyData;
          })
          .create();
      }),
    );

    const pois = await Promise.all(
      times(4, () => {
        return factory(ReefPointOfInterest)()
          .map(async (poi) => {
            poi.reef = reef;
            return poi;
          })
          .create();
      }),
    );

    const metrics = [
      Metric.ALERT,
      Metric.DHW,
      Metric.SATELLITE_TEMPERATURE,
      Metric.TOP_TEMPERATURE,
      Metric.BOTTOM_TEMPERATURE,
      Metric.SST_ANOMALY,
    ];

    const sources = await Promise.all(
      pois.map((poi) => {
        return factory(Sources)()
          .map(async (data) => {
            data.reef = reef;
            data.poi = poi;
            data.type = SourceType.HOBO;
            return data;
          })
          .create();
      }),
    );

    const sourcesMap: { [k: number]: Sources } = Object.fromEntries(
      sources.map((source) => [source.poi!.id, source]),
    );

    await Promise.all(
      times(1000, () => {
        return factory(TimeSeries)()
          .map(async (data) => {
            const metricId = Math.floor(Math.random() * 5);
            const poiId = Math.floor(Math.random() * 4);
            data.source = sourcesMap[pois[poiId].id];
            data.metric = metrics[metricId];
            return data;
          })
          .create();
      }),
    );
  }
}

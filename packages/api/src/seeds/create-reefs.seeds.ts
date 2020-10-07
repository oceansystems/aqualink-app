import { Factory, Seeder } from 'typeorm-seeding';
import { Reef } from '../reefs/reefs.entity';
import { DailyData } from '../reefs/daily-data.entity';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';

export class CreateReef implements Seeder {
  public async run(factory: Factory) {
    const reef = await factory(Reef)().create();

    const startDate = new Date(2020, 1, 1);
    const dates = [...Array(10).keys()].map((i) => {
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

    await Promise.all(
      [...Array(4).keys()].map(() => {
        return factory(ReefPointOfInterest)()
          .map(async (poi) => {
            poi.reef = reef;
            return poi;
          })
          .create();
      }),
    );
  }
}

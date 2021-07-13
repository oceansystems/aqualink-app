import _ from 'lodash';
import { Repository } from 'typeorm';
import { CollectionDataDto } from '../collections/dto/collection-data.dto';
import { Reef } from '../reefs/reefs.entity';
import { SourceType } from '../reefs/schemas/source-type.enum';
import { LatestData } from '../time-series/latest-data.entity';

export const getCollectionData = async (
  reefs: Reef[],
  latestDataRepository: Repository<LatestData>,
): Promise<Record<number, CollectionDataDto>> => {
  const reefIds = reefs.map((reef) => reef.id);

  if (!reefIds.length) {
    return {};
  }

  // Get latest data
  const latestData: LatestData[] = await latestDataRepository
    .createQueryBuilder('latest_data')
    .select('id')
    .addSelect('timestamp')
    .addSelect('value')
    .addSelect('reef_id', 'reefId')
    .addSelect('poi_id', 'poiId')
    .addSelect('metric')
    .addSelect('source')
    .where('reef_id IN (:...reefIds)', { reefIds })
    .andWhere('source != :hoboSource', { hoboSource: SourceType.HOBO })
    .getRawMany();

  // Map data to each reef and map each reef's data to the CollectionDataDto
  return _(latestData)
    .groupBy((o) => o.reefId)
    .mapValues<CollectionDataDto>((data) =>
      data.reduce<CollectionDataDto>((acc, reefData): CollectionDataDto => {
        return {
          ...acc,
          [reefData.metric]: reefData.value,
        };
      }, {}),
    )
    .toJSON();
};

export const DEFAULT_COLLECTION_NAME = 'My Dashboard';

export const defaultUserCollection = (
  userId: number,
  reefIds: number[] = [],
  name = DEFAULT_COLLECTION_NAME,
) => ({
  user: { id: userId },
  name,
  reefs: reefIds.map((reefId) => ({ id: reefId })),
});

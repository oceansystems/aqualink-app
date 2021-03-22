import { chunk, Dictionary, groupBy, keyBy, minBy } from 'lodash';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { Point, GeoJSON } from 'geojson';
import moment, { Moment } from 'moment';
import Bluebird from 'bluebird';
import { ExifParserFactory } from 'ts-exif-parser';
import { Reef, ReefStatus } from '../reefs/reefs.entity';
import { ReefPointOfInterest } from '../reef-pois/reef-pois.entity';
import { Metric } from '../time-series/metrics.entity';
import { TimeSeries } from '../time-series/time-series.entity';
import { User } from '../users/users.entity';
import { Survey, WeatherConditions } from '../surveys/surveys.entity';
import { GoogleCloudService } from '../google-cloud/google-cloud.service';
import {
  MediaType,
  Observations,
  SurveyMedia,
} from '../surveys/survey-media.entity';
import { Sources, SourceType } from '../reefs/sources.entity';
import { backfillReefData } from '../workers/backfill-reef-data';
import { getRegion, getTimezones } from './reef.utils';
import { getMMM, getMonthlyMaximums } from './temperature';
import { Region } from '../regions/regions.entity';
import { MonthlyMax } from '../reefs/monthly-max.entity';
import { createPoint } from './coordinates';

interface Coords {
  reef: number;
  colony: number;
  lat: number;
  long: number;
}

interface Data {
  id: number;
  dateTime: Date;
  bottomTemperature: number;
}

interface Repositories {
  reefRepository: Repository<Reef>;
  poiRepository: Repository<ReefPointOfInterest>;
  timeSeriesRepository: Repository<TimeSeries>;
  userRepository: Repository<User>;
  surveyRepository: Repository<Survey>;
  surveyMediaRepository: Repository<SurveyMedia>;
  sourcesRepository: Repository<Sources>;
  regionRepository: Repository<Region>;
  monthlyMaxRepository: Repository<MonthlyMax>;
}

const FOLDER_PREFIX = 'Patch_Reef_';
const COLONY_COORDS_FILE = 'Colony_Coords.xlsx';
const COLONY_FOLDER_PREFIX = 'Col_';
const COLONY_PREFIX = 'Colony ';
const COLONY_DATA_FILE = 'Col{}_FullHOBO.xlsx';
const validFiles = new Set(['png', 'jpeg', 'jpg']);

const logger = new Logger('ParseHoboData');

/**
 * Parse XLSX data
 * @param filePath The path to the xlsx file
 * @param header The headers to be used
 * @param range The amount or rows to skip
 */
const parseXLSX = <T>(
  filePath: string,
  header: string[],
  range: number = 1,
): T[] => {
  // Get excel workbook (parse dates)
  const workbook = xlsx.readFile(filePath, { cellDates: true });
  // Get first sheet as only the first sheet will be used
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  // Convert first sheet to json skipping header row and renaming the headers
  return xlsx.utils.sheet_to_json(firstSheet, { header, range });
};

const reefQuery = (reefRepository: Repository<Reef>, polygon?: GeoJSON) => {
  return reefRepository
    .createQueryBuilder(`entity`)
    .where(
      `entity.polygon = ST_SetSRID(ST_GeomFromGeoJSON(:polygon), 4326)::geometry`,
      { polygon },
    )
    .getOne();
};

const poiQuery = (
  poiRepository: Repository<ReefPointOfInterest>,
  polygon?: GeoJSON,
) => {
  return poiRepository
    .createQueryBuilder(`pois`)
    .innerJoinAndSelect('pois.reef', 'reef')
    .where(
      `pois.polygon = ST_SetSRID(ST_GeomFromGeoJSON(:polygon), 4326)::geometry`,
      { polygon },
    )
    .getOne();
};

/**
 * Handle entity duplication because of spatial key constraint
 * @param repository The repository for the entity
 * @param polygon The polygon value
 */
const handleEntityDuplicate = <T>(
  repository: Repository<T>,
  query: (
    repository: Repository<T>,
    polygon?: GeoJSON,
  ) => Promise<T | undefined>,
  polygon?: GeoJSON,
) => {
  return (err) => {
    // Catch unique violation, i.e. there is already a reef at this location
    if (err.code === '23505') {
      return query(repository, polygon).then((found) => {
        if (!found) {
          throw new InternalServerErrorException(
            'Could not fetch conflicting entry',
          );
        }

        return found;
      });
    }

    throw err;
  };
};

/**
 * Round up timestamp to the closest minute
 * @param timestamp A moment timestamp
 */
const roundUpTimestamp = (timestamp: Moment) => {
  const rounded =
    timestamp.second() || timestamp.millisecond()
      ? timestamp.add(1, 'minute')
      : timestamp;
  return rounded.startOf('minute').toDate();
};

/**
 * Read Coords.xlsx file
 * @param rootPath The path of the root of the data folder
 * @param reefIds The reefIds to be imported
 */
const readCoordsFile = (rootPath: string, reefIds: number[]) => {
  // Read coords file
  const coordsFilePath = path.join(rootPath, COLONY_COORDS_FILE);
  const coordsHeaders = ['reef', 'colony', 'lat', 'long'];
  return parseXLSX<Coords>(coordsFilePath, coordsHeaders).filter((record) => {
    return reefIds.includes(record.reef);
  });
};

/**
 * Create reef records
 * Calculate their position by finding the average of the coordinates of all pois in xlsx file
 * @param dataAsJson The json data from the xlsx file
 * @param reefIds The reefs to be imported
 * @param regionRepository The region repository
 */
const getReefRecords = async (
  dataAsJson: Coords[],
  reefIds: number[],
  regionRepository: Repository<Region>,
) => {
  // Group by reef
  const recordsGroupedByReef = groupBy(dataAsJson, 'reef');

  // Extract reef entities and calculate position of reef by averaging all each pois positions
  const reefs = await Promise.all(
    reefIds.map((reefId) => {
      const filteredReefCoords = recordsGroupedByReef[reefId];

      const reefRecord = filteredReefCoords.reduce(
        (previous, record) => {
          return {
            ...previous,
            lat: previous.lat + record.lat,
            long: previous.long + record.long,
          };
        },
        { reef: reefId, colony: 0, lat: 0, long: 0 },
      );

      // Calculate reef position
      const point: Point = createPoint(
        reefRecord.long / filteredReefCoords.length,
        reefRecord.lat / filteredReefCoords.length,
      );

      // Augment reef information
      const [longitude, latitude] = point.coordinates;
      const timezones = getTimezones(latitude, longitude) as string[];

      return Promise.all([
        getRegion(longitude, latitude, regionRepository),
        getMMM(longitude, latitude),
      ]).then(([region, maxMonthlyMean]) => ({
        name: FOLDER_PREFIX + reefId,
        polygon: point,
        region,
        maxMonthlyMean,
        approved: true,
        timezone: timezones[0],
        status: ReefStatus.Approved,
      }));
    }),
  );

  return { recordsGroupedByReef, reefs };
};

/**
 * Save reef records to database or fetch already existing reefs
 * @param reefs The reef records to be saved
 * @param user The user to associate reef with
 * @param reefRepository The reef repository
 * @param userRepository The user repository
 * @param monthlyMaxRepository The monthly max repository
 */
const createReefs = async (
  reefs: Partial<Reef>[],
  user: User,
  reefRepository: Repository<Reef>,
  userRepository: Repository<User>,
  monthlyMaxRepository: Repository<MonthlyMax>,
) => {
  logger.log('Saving reefs');
  const reefEntities = await Promise.all(
    reefs.map((reef) =>
      reefRepository
        .save(reef)
        .catch(handleEntityDuplicate(reefRepository, reefQuery, reef.polygon)),
    ),
  );

  logger.log(`Saving monthly max data`);
  await Promise.all(
    reefEntities.map((reef) => {
      const point: Point = reef.polygon as Point;
      const [longitude, latitude] = point.coordinates;

      return Promise.all([
        getMonthlyMaximums(longitude, latitude),
        monthlyMaxRepository.findOne({ where: { reef } }),
      ]).then(([monthlyMaximums, found]) => {
        if (found || !monthlyMaximums) {
          logger.warn(`Reef ${reef.id} has already monthly max data`);
          return null;
        }

        return monthlyMaximums.map(({ month, temperature }) => {
          return (
            temperature &&
            monthlyMaxRepository.save({ reef, month, temperature })
          );
        });
      });
    }),
  );

  // Create reverse map (db.reef.id => xlsx.reef_id)
  const dbIdToXLSXId: Record<number, number> = Object.fromEntries(
    reefEntities.map((reef) => {
      const reefId = parseInt(reef.name.replace(FOLDER_PREFIX, ''), 10);
      return [reef.id, reefId];
    }),
  );

  // Update administered reefs relationship
  await userRepository.save({
    id: user.id,
    administeredReefs: user.administeredReefs.concat(reefEntities),
  });

  return { reefEntities, dbIdToXLSXId };
};

/**
 * Create and save reef point of interest records
 * @param reefEntities The saved reef entities
 * @param dbIdToXLSXId The reverse map (db.reef.id => xlsx.reef_id)
 * @param recordsGroupedByReef The reef records grouped by reef id
 * @param rootPath The path to the root of the data folder
 * @param poiRepository The poi repository
 */
const createPois = async (
  reefEntities: Reef[],
  dbIdToXLSXId: Record<number, number>,
  recordsGroupedByReef: Dictionary<Coords[]>,
  rootPath: string,
  poiRepository: Repository<ReefPointOfInterest>,
) => {
  // Create reef points of interest entities for each imported reef
  // Final result needs to be flattened since the resulting array is grouped by reef
  const pois = reefEntities
    .map((reef) => {
      const currentReefId = dbIdToXLSXId[reef.id];
      const reefFolder = FOLDER_PREFIX + currentReefId;
      return recordsGroupedByReef[currentReefId]
        .filter((record) => {
          const colonyId = record.colony.toString().padStart(3, '0');
          const colonyFolder = COLONY_FOLDER_PREFIX + colonyId;
          const colonyFolderPath = path.join(
            rootPath,
            reefFolder,
            colonyFolder,
          );

          return fs.existsSync(colonyFolderPath);
        })
        .map((record) => {
          const point: Point = createPoint(record.long, record.lat);

          return {
            name: COLONY_PREFIX + record.colony,
            reef,
            polygon: point,
          };
        });
    })
    .flat();

  logger.log('Saving reef points of interest');
  const poiEntities = await Promise.all(
    pois.map((poi) =>
      poiRepository
        .save(poi)
        .catch(handleEntityDuplicate(poiRepository, poiQuery, poi.polygon)),
    ),
  );

  return poiEntities;
};

/**
 * Create source entities
 * @param poiEntities The created poi entities
 * @param sourcesRepository The sources repository
 */
const createSources = async (
  poiEntities: ReefPointOfInterest[],
  sourcesRepository: Repository<Sources>,
) => {
  // Create sources for each new poi
  const sources = poiEntities.map((poi) => {
    return {
      reef: poi.reef,
      poi,
      type: SourceType.HOBO,
    };
  });

  logger.log('Saving sources');
  const sourceEntities = await Promise.all(
    sources.map((source) =>
      sourcesRepository
        .findOne({
          relations: ['poi'],
          where: { reef: source.reef, poi: source.poi, type: source.type },
        })
        .then((foundSource) => {
          if (foundSource) {
            return foundSource;
          }

          return sourcesRepository.save(source);
        }),
    ),
  );

  // Map pois to created sources
  return keyBy(sourceEntities, (o) => o.poi.id);
};

/**
 * Parse hobo xlsx
 * @param poiEntities The created poi entities
 * @param dbIdToXLSXId The reverse map (db.reef.id => xlsx.reef_id)
 * @param rootPath The path to the root of the data folder
 * @param poiToSourceMap A object to map pois to source entities
 * @param timeSeriesRepository The time series repository
 */
const parseHoboData = (
  poiEntities: ReefPointOfInterest[],
  dbIdToXLSXId: Record<number, number>,
  rootPath: string,
  poiToSourceMap: Dictionary<Sources>,
  timeSeriesRepository: Repository<TimeSeries>,
) => {
  // Parse hobo data
  const parsedData = poiEntities.map((poi) => {
    const colonyId = poi.name.split(' ')[1].padStart(3, '0');
    const dataFile = COLONY_DATA_FILE.replace('{}', colonyId);
    const colonyFolder = COLONY_FOLDER_PREFIX + colonyId;
    const reefFolder = FOLDER_PREFIX + dbIdToXLSXId[poi.reef.id];
    const filePath = path.join(rootPath, reefFolder, colonyFolder, dataFile);
    const headers = ['id', 'dateTime', 'bottomTemperature'];
    return parseXLSX<Data>(filePath, headers).map((data) => ({
      timestamp: roundUpTimestamp(moment(data.dateTime).add(8, 'h')),
      reef: poi.reef,
      poi,
      value: data.bottomTemperature,
      source: poiToSourceMap[poi.id],
      metric: Metric.BOTTOM_TEMPERATURE,
    }));
  });

  // Find the earliest date of data
  const startDates = parsedData.reduce((acc, data) => {
    const minimum = minBy(data, (o) => o.timestamp);

    if (!minimum) {
      return acc;
    }

    return acc.concat(minimum);
  }, []);

  const groupedStartedDates = groupBy(startDates, (o) => o.reef.id);

  // Start a backfill for each reef
  Object.keys(groupedStartedDates).forEach((reefId) => {
    const startDate = minBy(groupedStartedDates[reefId], (o) => o.timestamp);
    if (!startDate) {
      return;
    }

    const start = moment(startDate.timestamp);
    const end = moment();
    const diff = Math.min(end.diff(start, 'd'), 200);
    logger.log(
      `Performing backfill for reef ${startDate.reef.id} for ${diff} days`,
    );
    backfillReefData(startDate.reef.id, diff);
  });

  const bottomTemperatureData = parsedData.flat();

  // Data are to much to added with one bulk insert
  // So we need to break them in batches
  const batchSize = 1000;
  logger.log(`Saving time series data in batches of ${batchSize}`);
  const inserts = chunk(bottomTemperatureData, batchSize).map((batch) => {
    return timeSeriesRepository
      .createQueryBuilder('time_series')
      .insert()
      .values(batch)
      .onConflict('ON CONSTRAINT "no_duplicate_data" DO NOTHING')
      .execute();
  });

  // Return insert promises and print progress updates
  const actionsLength = inserts.length;
  return Bluebird.Promise.each(inserts, (props, idx) => {
    logger.log(`Saved ${idx + 1} out of ${actionsLength} batches`);
  });
};

/**
 * Upload reef photos and create for each image a new survey and an associated survey media
 * As diveDate the creation date of the image will be used
 * @param poiEntities The create poi entities
 * @param dbIdToXLSXId The reverse map (db.reef.id => xlsx.reef_id)
 * @param rootPath The path to the root of the data folder
 * @param googleCloudService The google cloud service instance
 * @param user A user to associate the surveys with
 * @param surveyRepository The survey repository
 * @param surveyMediaRepository The survey media repository
 */
const uploadReefPhotos = async (
  poiEntities: ReefPointOfInterest[],
  dbIdToXLSXId: Record<number, number>,
  rootPath: string,
  googleCloudService: GoogleCloudService,
  user: User,
  surveyRepository: Repository<Survey>,
  surveyMediaRepository: Repository<SurveyMedia>,
) => {
  // Find and images and extract their metadata
  const imageData = poiEntities
    .map((poi) => {
      const colonyId = poi.name.split(' ')[1].padStart(3, '0');
      const colonyFolder = COLONY_FOLDER_PREFIX + colonyId;
      const reefFolder = FOLDER_PREFIX + dbIdToXLSXId[poi.reef.id];
      const colonyFolderPath = path.join(rootPath, reefFolder, colonyFolder);
      const contents = fs.readdirSync(colonyFolderPath);
      const images = contents.filter((f) => {
        const ext = path.extname(f).toLowerCase().replace('.', '');
        return validFiles.has(ext);
      });

      return images.map((image) => {
        const data = ExifParserFactory.create(
          fs.readFileSync(path.join(colonyFolderPath, image)),
        ).parse();
        const createdDate =
          data.tags && data.tags.CreateDate
            ? moment.unix(data.tags.CreateDate).toDate()
            : moment().toDate();
        return {
          imagePath: path.join(colonyFolderPath, image),
          reef: poi.reef,
          poi,
          createdDate,
        };
      });
    })
    .flat();

  logger.log('Upload photos to google cloud');
  const imageLength = imageData.length;
  const surveyMedia = await Bluebird.each(
    imageData.map((image) =>
      googleCloudService.uploadFile(image.imagePath, 'image').then((url) => {
        const survey = {
          reef: image.reef,
          userId: user,
          diveDate: image.createdDate,
          weatherConditions: WeatherConditions.NoData,
        };

        return surveyRepository.save(survey).then((surveyEntity) => {
          return {
            url,
            featured: true,
            hidden: false,
            type: MediaType.Image,
            poiId: image.poi,
            surveyId: surveyEntity,
            metadata: JSON.stringify({}),
            observations: Observations.NoData,
          };
        });
      }),
    ),
    (data, idx) => {
      logger.log(`${idx + 1} images uploaded out of ${imageLength}`);
      return data;
    },
  );

  logger.log('Saving survey media');
  await surveyMediaRepository.save(surveyMedia);
};

// Upload hobo data
// Returns a object with keys the db reef ids and values the corresponding imported reef ids
export const uploadHoboData = async (
  rootPath: string,
  email: string,
  googleCloudService: GoogleCloudService,
  repositories: Repositories,
): Promise<Record<string, number>> => {
  // Grab user and check if they exist
  const user = await repositories.userRepository.findOne({
    where: { email },
    relations: ['administeredReefs'],
  });

  if (!user) {
    logger.error(`No user was found with email ${email}`);
    throw new BadRequestException('User was not found');
  }

  const reefSet = fs
    .readdirSync(rootPath)
    .filter((f) => {
      // File must be directory and be in Patch_Reef_{reef_id} format
      return (
        fs.statSync(path.join(rootPath, f)).isDirectory() &&
        f.includes(FOLDER_PREFIX)
      );
    })
    .map((reefFolder) => {
      return parseInt(reefFolder.replace(FOLDER_PREFIX, ''), 10);
    });

  const dataAsJson = readCoordsFile(rootPath, reefSet);

  const { recordsGroupedByReef, reefs } = await getReefRecords(
    dataAsJson,
    reefSet,
    repositories.regionRepository,
  );

  const { reefEntities, dbIdToXLSXId } = await createReefs(
    reefs,
    user,
    repositories.reefRepository,
    repositories.userRepository,
    repositories.monthlyMaxRepository,
  );

  const poiEntities = await createPois(
    reefEntities,
    dbIdToXLSXId,
    recordsGroupedByReef,
    rootPath,
    repositories.poiRepository,
  );

  const poiToSourceMap = await createSources(
    poiEntities,
    repositories.sourcesRepository,
  );

  await parseHoboData(
    poiEntities,
    dbIdToXLSXId,
    rootPath,
    poiToSourceMap,
    repositories.timeSeriesRepository,
  );

  await uploadReefPhotos(
    poiEntities,
    dbIdToXLSXId,
    rootPath,
    googleCloudService,
    user,
    repositories.surveyRepository,
    repositories.surveyMediaRepository,
  );

  return dbIdToXLSXId;
};
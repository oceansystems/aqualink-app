import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './surveys.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { User } from '../users/users.entity';
import { CreateSurveyMediaDto } from './dto/create-survey-media.dto';
import { SurveyMedia, MediaType } from './survey-media.entity';
import { EditSurveyDto } from './dto/edit-survey.dto';
import { EditSurveyMediaDto } from './dto/edit-survey-media.dto';
import { GoogleCloudService } from '../google-cloud/google-cloud.service';
import { Reef } from '../reefs/reefs.entity';
import { getFileFromURL } from '../utils/google-cloud.utils';

@Injectable()
export class SurveysService {
  private logger: Logger = new Logger(SurveysService.name);

  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,

    @InjectRepository(SurveyMedia)
    private surveyMediaRepository: Repository<SurveyMedia>,

    @InjectRepository(Reef)
    private reefRepository: Repository<Reef>,

    private googleCloudService: GoogleCloudService,
  ) {}

  // Create a survey
  async create(
    createSurveyDto: CreateSurveyDto,
    user: User,
    reefId: number,
  ): Promise<Survey> {
    const reef = await this.reefRepository.findOne(reefId);

    if (!reef) {
      throw new NotFoundException(`Reef with id ${reefId} was not found.`);
    }

    const survey = await this.surveyRepository.save({
      userId: user,
      reef,
      ...createSurveyDto,
      comments: this.transformComments(createSurveyDto.comments),
    });

    return survey;
  }

  // Create a survey media (video or image)
  async createMedia(
    createSurveyMediaDto: CreateSurveyMediaDto,
    surveyId: number,
  ): Promise<SurveyMedia> {
    const survey = await this.surveyRepository.findOne(surveyId);
    if (!survey) {
      throw new NotFoundException(`Survey with id ${surveyId} was not found`);
    }

    // Check if a featured media already exists for this survey
    const featuredMedia = await this.surveyMediaRepository.findOne({
      where: {
        featured: true,
        surveyId: survey,
      },
    });

    const newFeatured =
      featuredMedia &&
      createSurveyMediaDto.featured &&
      !createSurveyMediaDto.hidden;

    if (featuredMedia && newFeatured) {
      await this.surveyMediaRepository.update(featuredMedia.id, {
        featured: false,
      });
    }

    return this.surveyMediaRepository.save({
      ...createSurveyMediaDto,
      featured:
        newFeatured ||
        (!featuredMedia &&
          createSurveyMediaDto.featured &&
          !createSurveyMediaDto.hidden),
      type: MediaType.Image,
      surveyId: survey,
      comments: this.transformComments(createSurveyMediaDto.comments),
    });
  }

  // Find all surveys related to a specific reef.
  async find(reefId: number): Promise<Survey[]> {
    const surveyHistoryQuery = await this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndMapOne(
        'survey.latestDailyData',
        'daily_data',
        'data',
        'data.reef_id = survey.reef_id AND DATE(data.date) = DATE(survey.diveDate)',
      )
      .innerJoin('survey.userId', 'users')
      .leftJoinAndSelect(
        'survey.featuredSurveyMedia',
        'featuredSurveyMedia',
        'featuredSurveyMedia.featured = True',
      )
      .leftJoinAndSelect('featuredSurveyMedia.poiId', 'poi')
      .addSelect(['users.fullName', 'users.id'])
      .where('survey.reef_id = :reefId', { reefId })
      .getMany();

    const surveyObservationsQuery = await this.surveyMediaRepository
      .createQueryBuilder('surveyMedia')
      .innerJoin(
        'surveyMedia.surveyId',
        'surveys',
        'surveys.reef_id = :reefId',
        { reefId },
      )
      .groupBy('surveyMedia.surveyId, surveyMedia.observations')
      .select(['surveyMedia.surveyId', 'surveyMedia.observations'])
      .getRawMany();

    const surveyPointsQuery = await this.surveyMediaRepository
      .createQueryBuilder('surveyMedia')
      .innerJoin(
        'surveyMedia.surveyId',
        'surveys',
        'surveys.reef_id = :reefId',
        { reefId },
      )
      .groupBy('surveyMedia.surveyId, surveyMedia.poiId')
      .select(['surveyMedia.surveyId', 'surveyMedia.poiId'])
      .getRawMany();

    const observationsGroupedBySurveyId = this.groupBySurveyId(
      surveyObservationsQuery,
      'surveyMedia_observations',
    );
    const poiIdGroupedBySurveyId = this.groupBySurveyId(
      surveyPointsQuery,
      'poi_id',
    );

    return surveyHistoryQuery.map((survey) => {
      const surveyDailyData = survey.latestDailyData;
      return {
        id: survey.id,
        diveDate: survey.diveDate,
        comments: survey.comments,
        weatherConditions: survey.weatherConditions,
        userId: survey.userId,
        // If no logged temperature exists grab the latest daily temperature of the survey's date
        temperature:
          survey.temperature ||
          (surveyDailyData &&
            (surveyDailyData.avgBottomTemperature ||
              surveyDailyData.satelliteTemperature)),
        featuredSurveyMedia: survey.featuredSurveyMedia,
        observations: observationsGroupedBySurveyId[survey.id] || [],
        surveyPoints: poiIdGroupedBySurveyId[survey.id] || [],
      };
    });
  }

  // Find one survey provided its id
  // Include its surveyMedia grouped by reefPointOfInterest
  async findOne(surveyId: number): Promise<Survey> {
    const surveyDetails = await this.surveyRepository
      .createQueryBuilder('survey')
      .innerJoinAndSelect('survey.surveyMedia', 'surveyMedia')
      .leftJoinAndSelect('surveyMedia.poiId', 'pois')
      .where('survey.id = :surveyId', { surveyId })
      .andWhere('surveyMedia.hidden = False')
      .getOne();

    if (!surveyDetails) {
      throw new NotFoundException(`Survey with id ${surveyId} was not found`);
    }

    return surveyDetails;
  }

  async findMedia(surveyId: number): Promise<SurveyMedia[]> {
    return this.surveyMediaRepository
      .createQueryBuilder('surveyMedia')
      .leftJoinAndSelect('surveyMedia.poiId', 'poi')
      .where('surveyMedia.surveyId = :surveyId', { surveyId })
      .getMany();
  }

  async update(
    editSurveyDto: EditSurveyDto,
    surveyId: number,
  ): Promise<Survey> {
    const result = await this.surveyRepository.update(surveyId, {
      ...editSurveyDto,
      comments: this.transformComments(editSurveyDto.comments),
    });

    if (!result.affected) {
      throw new NotFoundException(`Survey with id ${surveyId} was not found`);
    }
    const updated = await this.surveyRepository.findOne(surveyId);

    if (!updated) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return updated;
  }

  async updateMedia(
    editSurveyMediaDto: EditSurveyMediaDto,
    mediaId: number,
  ): Promise<SurveyMedia> {
    const surveyMedia = await this.surveyMediaRepository.findOne(mediaId);

    if (!surveyMedia) {
      throw new NotFoundException(
        `Survey media with id ${mediaId} was not found`,
      );
    }

    if (
      surveyMedia.featured &&
      (editSurveyMediaDto.hidden || !editSurveyMediaDto.featured)
    ) {
      await this.assignFeaturedMedia(surveyMedia.surveyId.id, mediaId);
    }

    if (
      !surveyMedia.featured &&
      !editSurveyMediaDto.hidden &&
      editSurveyMediaDto.featured
    ) {
      await this.surveyMediaRepository.update(
        {
          surveyId: surveyMedia.surveyId,
          featured: true,
        },
        { featured: false },
      );
    }

    const trimmedComments = this.transformComments(editSurveyMediaDto.comments);
    await this.surveyMediaRepository.update(mediaId, {
      ...editSurveyMediaDto,
      featured: !editSurveyMediaDto.hidden && editSurveyMediaDto.featured,
      ...(trimmedComments ? { comments: trimmedComments } : {}),
    });

    const updated = await this.surveyMediaRepository.findOne(mediaId);

    if (!updated) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return updated;
  }

  async delete(surveyId: number): Promise<void> {
    const surveyMedia = await this.surveyMediaRepository.find({
      where: { surveyId },
    });

    await Promise.all(
      surveyMedia.map((media) => {
        const imageUrl = getFileFromURL(media.imageUrl);
        // Thumbnail might not exist
        const thumbnailUrl =
          media.thumbnailUrl && getFileFromURL(media.thumbnailUrl);

        return Promise.all(
          [imageUrl, thumbnailUrl].map((file) => {
            if (file) {
              return this.googleCloudService.deleteFile(file).catch((error) => {
                this.logger.error(
                  `Could not delete media ${file} of survey ${surveyId}.`,
                  error,
                );
              });
            }

            return null;
          }),
        );
      }),
    );

    const result = await this.surveyRepository.delete(surveyId);

    if (!result.affected) {
      throw new NotFoundException(`Survey with id ${surveyId} was not found`);
    }
  }

  async deleteMedia(mediaId: number): Promise<void> {
    const surveyMedia = await this.surveyMediaRepository.findOne(mediaId);

    if (!surveyMedia) {
      throw new NotFoundException(
        `Survey media with id ${mediaId} was not found`,
      );
    }

    if (surveyMedia.featured) {
      await this.assignFeaturedMedia(surveyMedia.surveyId.id, mediaId);
    }

    // We need to grab the path/to/file. So we split the url on "{GCS_BUCKET}/"
    // and grab the second element of the resulting array which is the path we need
    await Promise.all(
      [surveyMedia.imageUrl, surveyMedia.thumbnailUrl].map((file) => {
        if (file) {
          return this.googleCloudService
            .deleteFile(getFileFromURL(file))
            .catch((error) => {
              this.logger.error(
                `Could not delete media ${file} of survey media ${mediaId}.`,
              );
              throw error;
            });
        }

        return null;
      }),
    );

    await this.surveyMediaRepository.delete(mediaId);
  }

  /**
   * Assign a random survey media as the featured media of the survey,
   * because the current one will be unset.
   *
   * The new media should be not hidden.
   *
   * If no such media exists no featured media is assigned.
   *
   * @param surveyId The survey id
   * @param mediaId The media id that was previously featured and should be excluded
   */
  private async assignFeaturedMedia(surveyId: number, mediaId: number) {
    const surveyMedia = await this.surveyMediaRepository
      .createQueryBuilder('surveyMedia')
      .where('surveyMedia.surveyId = :surveyId ', { surveyId })
      .andWhere('id != :mediaId', { mediaId })
      .andWhere('hidden != True')
      .getOne();

    if (!surveyMedia) {
      return;
    }

    await this.surveyMediaRepository.update(surveyMedia.id, { featured: true });
  }

  /**
   * Transform all empty-like comments to null values to not have to deal with different types of empty comments
   *
   * @param comments The comments to transform
   */
  private transformComments(comments?: string) {
    if (comments === undefined) {
      return undefined;
    }

    const trimmedComments = comments.trim();
    return trimmedComments === '' ? undefined : trimmedComments;
  }

  private groupBySurveyId(object: any[], key: string) {
    return object.reduce((rv, x) => {
      return {
        ...rv,
        [x.survey_id]: [...(rv[x.survey_id] || []), x[key]],
      };
    }, {});
  }
}

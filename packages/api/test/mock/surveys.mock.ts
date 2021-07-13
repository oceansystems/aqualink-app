import moment from 'moment';
import { DeepPartial } from 'typeorm';
import { Survey, WeatherConditions } from '../../src/surveys/surveys.entity';
import { californiaReef } from './reef.mock';
import { reefManagerUserMock } from './user.mock';

export const californiaSurveyOne: DeepPartial<Survey> = {
  comments: 'California Survey One',
  diveDate: moment().subtract(6, 'days').toISOString(),
  temperature: 22,
  weatherConditions: WeatherConditions.Calm,
  user: reefManagerUserMock,
  reef: californiaReef,
};

export const californiaSurveyTwo: DeepPartial<Survey> = {
  comments: 'California Survey Two',
  diveDate: moment().subtract(2, 'days').toISOString(),
  temperature: 23,
  weatherConditions: WeatherConditions.Calm,
  user: reefManagerUserMock,
  reef: californiaReef,
};

export const surveys = [californiaSurveyOne, californiaSurveyTwo];

import {
  Controller,
  Post,
  UploadedFile,
  Body,
  Req,
  Param,
  ParseIntPipe,
  Get,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AcceptFile } from '../uploads/file.decorator';
import { Auth } from '../auth/auth.decorator';
import { AdminLevel } from '../users/users.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Survey } from './surveys.entity';
import { SurveysService } from './surveys.service';
import { CreateSurveyMediaDto } from './dto/create-survey-media.dto';
import { SurveyMedia } from './survey-media.entity';
import { EditSurveyDto } from './dto/edit-survey.dto';
import { EditSurveyMediaDto } from './dto/edit-survey-media.dto';
import { IsReefAdminGuard } from '../auth/is-reef-admin.guard';
import { AuthRequest } from '../auth/auth.types';
import { Public } from '../auth/public.decorator';

@UseGuards(IsReefAdminGuard)
@Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
@Controller('reefs/:reef_id/surveys')
export class SurveysController {
  constructor(private surveyService: SurveysService) {}

  @Post('upload')
  @AcceptFile('file', ['image', 'video'], 'surveys', 'reef')
  upload(@UploadedFile('file') file: any): string {
    // Override file path because file.path provided an invalid google cloud format and HTTPS is not working correctly
    // Correct format of a URL pointing to a google cloud object should be
    // https://storage.googleapis.com/{bucketName}/path/to/object/in/bucket
    return `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${file.filename}`;
  }

  @Post()
  create(
    @Body() createSurveyDto: CreateSurveyDto,
    @Param('reef_id', ParseIntPipe) reefId: number,
    @Req() req: AuthRequest,
  ): Promise<Survey> {
    return this.surveyService.create(createSurveyDto, req.user, reefId);
  }

  @Post(':id/media')
  createMedia(
    @Body() createSurveyMediaDto: CreateSurveyMediaDto,
    @Param('id', ParseIntPipe) surveyId: number,
  ): Promise<SurveyMedia> {
    return this.surveyService.createMedia(createSurveyMediaDto, surveyId);
  }

  @Public()
  @Get()
  find(@Param('reef_id', ParseIntPipe) reefId: number): Promise<Survey[]> {
    return this.surveyService.find(reefId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) surveyId: number): Promise<Survey> {
    return this.surveyService.findOne(surveyId);
  }

  @Public()
  @Get(':id/media')
  findMedia(@Param('id', ParseIntPipe) surveyId): Promise<SurveyMedia[]> {
    return this.surveyService.findMedia(surveyId);
  }

  @Put('media/:id')
  updateMedia(
    @Param('id', ParseIntPipe) mediaId: number,
    @Body() editSurveyMediaDto: EditSurveyMediaDto,
  ): Promise<SurveyMedia> {
    return this.surveyService.updateMedia(editSurveyMediaDto, mediaId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) surveyId: number,
    @Body() editSurveyDto: EditSurveyDto,
  ): Promise<Survey> {
    return this.surveyService.update(editSurveyDto, surveyId);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) surveyId: number): Promise<void> {
    return this.surveyService.delete(surveyId);
  }

  @Delete('media/:id')
  deleteMedia(@Param('id', ParseIntPipe) mediaId: number): Promise<void> {
    return this.surveyService.deleteMedia(mediaId);
  }
}

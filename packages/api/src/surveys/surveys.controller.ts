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

@Controller('reefs/:reef_id/surveys')
export class SurveysController {
  constructor(private surveyService: SurveysService) {}

  @UseGuards(IsReefAdminGuard)
  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Post('upload')
  @AcceptFile('file', ['image', 'video'], 'surveys', 'reef')
  upload(@UploadedFile('file') file: any): string {
    // Override file path because file.path provided an invalid google cloud format and HTTPS is not working correctly
    // Correct format of a URL pointing to a google cloud object should be
    // https://storage.googleapis.com/{bucketName}/path/to/object/in/bucket
    return `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${file.filename}`;
  }

  @UseGuards(IsReefAdminGuard)
  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Post()
  create(
    @Body() createSurveyDto: CreateSurveyDto,
    @Param('reef_id', ParseIntPipe) reefId: number,
    @Req() req: any,
  ): Promise<Survey> {
    return this.surveyService.create(createSurveyDto, req.user, reefId);
  }

  @UseGuards(IsReefAdminGuard)
  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Post(':id/media')
  createMedia(
    @Body() createSurveyMediaDto: CreateSurveyMediaDto,
    @Param('id', ParseIntPipe) surveyId: number,
  ): Promise<SurveyMedia> {
    return this.surveyService.createMedia(createSurveyMediaDto, surveyId);
  }

  @Get()
  find(@Param('reef_id', ParseIntPipe) reefId: number): Promise<Survey[]> {
    return this.surveyService.find(reefId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) surveyId: number): Promise<Survey> {
    return this.surveyService.findOne(surveyId);
  }

  @Get(':id/media')
  findMedia(@Param('id', ParseIntPipe) surveyId): Promise<SurveyMedia[]> {
    return this.surveyService.findMedia(surveyId);
  }

  @UseGuards(IsReefAdminGuard)
  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Put('media/:id')
  updateMedia(
    @Param('id', ParseIntPipe) mediaId: number,
    @Body() editSurveyMediaDto: EditSurveyMediaDto,
  ): Promise<SurveyMedia> {
    return this.surveyService.updateMedia(editSurveyMediaDto, mediaId);
  }

  @UseGuards(IsReefAdminGuard)
  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) surveyId: number,
    @Body() editSurveyDto: EditSurveyDto,
  ): Promise<Survey> {
    return this.surveyService.update(editSurveyDto, surveyId);
  }

  @UseGuards(IsReefAdminGuard)
  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) surveyId: number): Promise<void> {
    return this.surveyService.delete(surveyId);
  }

  @UseGuards(IsReefAdminGuard)
  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Delete('media/:id')
  deleteMedia(@Param('id', ParseIntPipe) mediaId: number): Promise<void> {
    return this.surveyService.deleteMedia(mediaId);
  }
}

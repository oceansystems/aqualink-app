import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReefsService } from './reefs.service';
import { Reef } from './reefs.entity';
import { CreateReefDto } from './dto/create-reef.dto';
import { FilterReefDto } from './dto/filter-reef.dto';
import { UpdateReefDto } from './dto/update-reef.dto';
import surveys from '../../mock_response/survey_data.json';
import { AdminLevel } from '../users/users.entity';
import { Auth } from '../auth/auth.decorator';

@Controller('reefs')
export class ReefsController {
  constructor(private reefsService: ReefsService) {}

  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Post()
  create(@Body() createReefDto: CreateReefDto): Promise<Reef> {
    return this.reefsService.create(createReefDto);
  }

  @Get()
  find(@Query() filterReefDto: FilterReefDto): Promise<Reef[]> {
    return this.reefsService.find(filterReefDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Reef> {
    return this.reefsService.findOne(id);
  }

  @Get(':id/daily_data')
  // eslint-disable-next-line no-unused-vars
  findDailyData(@Param('id') id: number) {
    return this.reefsService.findDailyData(id);
  }

  @Get(':id/surveys/:poi')
  findSurveys(@Param('id') id: string, @Param('poi') poi: string) {
    return surveys.map((survey) => ({
      ...survey,
      images: survey.images.filter(
        (image) => image.poi_label_id === parseInt(poi, 10),
      ),
    }));
    // return this.reefRepository.findOneReef(id);
  }

  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReefDto: UpdateReefDto,
  ): Promise<Reef> {
    return this.reefsService.update(id, updateReefDto);
  }

  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reefsService.delete(id);
  }
}

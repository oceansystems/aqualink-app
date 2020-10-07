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
import { ReefPoisService } from './reef-pois.service';
import { ReefPointOfInterest } from './reef-pois.entity';
import { CreateReefPoiDto } from './dto/create-reef-poi.dto';
import { FilterReefPoiDto } from './dto/filter-reef-poi.dto';
import { UpdateReefPoiDto } from './dto/update-reef-poi.dto';
import { AdminLevel } from '../users/users.entity';
import { Auth } from '../auth/auth.decorator';
import { Public } from '../auth/public.decorator';

@Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
@Controller('pois')
export class ReefPoisController {
  constructor(private poisService: ReefPoisService) {}

  @Post()
  create(
    @Body() createReefPoiDto: CreateReefPoiDto,
  ): Promise<ReefPointOfInterest> {
    return this.poisService.create(createReefPoiDto);
  }

  @Public()
  @Get()
  find(
    @Query() filterReefPoiDto: FilterReefPoiDto,
  ): Promise<ReefPointOfInterest[]> {
    return this.poisService.find(filterReefPoiDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ReefPointOfInterest> {
    return this.poisService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReefPoiDto: UpdateReefPoiDto,
  ): Promise<ReefPointOfInterest> {
    return this.poisService.update(id, updateReefPoiDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.poisService.delete(id);
  }
}

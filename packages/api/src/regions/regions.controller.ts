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
import { RegionsService } from './regions.service';
import { Region } from './regions.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { FilterRegionDto } from './dto/filter-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Auth } from '../auth/auth.decorator';
import { AdminLevel } from '../users/users.entity';

@Controller('regions')
export class RegionsController {
  constructor(private regionsService: RegionsService) {}

  @Auth(AdminLevel.SuperAdmin)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto): Promise<Region> {
    return this.regionsService.create(createRegionDto);
  }

  @Get()
  find(@Query() filterRegionDto: FilterRegionDto): Promise<Region[]> {
    return this.regionsService.find(filterRegionDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Region> {
    return this.regionsService.findOne(id);
  }

  @Auth(AdminLevel.SuperAdmin)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRegionDto: UpdateRegionDto,
  ): Promise<Region> {
    return this.regionsService.update(id, updateRegionDto);
  }

  @Auth(AdminLevel.SuperAdmin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.regionsService.delete(id);
  }
}

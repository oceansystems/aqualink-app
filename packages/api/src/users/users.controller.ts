import {
  Controller,
  Body,
  Param,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
import { AdminLevel, User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from '../auth/auth.decorator';
import { AuthRequest } from '../auth/auth.types';
import { Reef } from '../reefs/reefs.entity';
import { OverrideLevelAccess } from '../auth/override-level-access.decorator';
import { Public } from '../auth/public.decorator';
import { ApiNestNotFoundResponse } from '../docs/api-response';
import { SetAdminLevelDto } from './dto/set-admin-level.dto';

@ApiTags('Users')
@Auth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @Public()
  @Post()
  create(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(req, createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns the currently signed in user' })
  @Get('current')
  getSelf(@Req() req: AuthRequest): Promise<User> {
    return this.usersService.getSelf(req);
  }

  @ApiBearerAuth()
  @ApiNestNotFoundResponse('No user was found with the specified id')
  @ApiOperation({ summary: 'Updates the access level of a user' })
  @ApiParam({ name: 'id', example: 1 })
  @OverrideLevelAccess(AdminLevel.SuperAdmin)
  @Put(':id/level')
  setAdminLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() setAdminLevelDto: SetAdminLevelDto,
  ): Promise<void> {
    return this.usersService.setAdminLevel(id, setAdminLevelDto.level);
  }

  @ApiBearerAuth()
  @ApiNestNotFoundResponse('No user was found with the specified id')
  @ApiOperation({ summary: 'Deletes specified user' })
  @ApiParam({ name: 'id', example: 1 })
  @OverrideLevelAccess(AdminLevel.SuperAdmin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.delete(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Returns the administered reefs of the signed in user',
  })
  @Get('current/administered-reefs')
  getAdministeredReefs(@Req() req: AuthRequest): Promise<Reef[]> {
    return this.usersService.getAdministeredReefs(req);
  }
}

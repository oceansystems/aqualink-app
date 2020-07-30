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
import { UsersService } from './users.service';
import { AdminLevel, User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from '../auth/auth.decorator';
import { AuthRequest } from '../auth/auth.types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Auth()
  @Get('self')
  getSelf(@Req() req: AuthRequest): Promise<User | undefined> {
    return this.usersService.getSelf(req);
  }

  @Auth(AdminLevel.SuperAdmin)
  @Put(':id/level/:level')
  setAdminLevel(
    @Param('id', ParseIntPipe) id: number,
    @Param('level') adminLevel: AdminLevel,
  ): Promise<void> {
    return this.usersService.setAdminLevel(id, adminLevel);
  }

  @Auth(AdminLevel.SuperAdmin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}

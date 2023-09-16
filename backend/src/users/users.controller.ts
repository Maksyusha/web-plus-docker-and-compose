import {
  Controller,
  Get,
  Body,
  Req,
  Patch,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FindManyDto } from './dto/find-many.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  patchMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getMyWishes(@Req() req) {
    return this.usersService.getWishes(req.user.username);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const { email, ...user } = await this.usersService.findByUsername(username);

    return user;
  }

  @Get(':username/wishes')
  findOneWishes(@Param('username') username: string) {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  findMany(@Body() findManyDto: FindManyDto) {
    return this.usersService.find(findManyDto);
  }
}

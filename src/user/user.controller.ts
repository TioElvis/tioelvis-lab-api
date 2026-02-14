import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }
}

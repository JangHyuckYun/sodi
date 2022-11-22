import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.create.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('list/all')
  async getAllUser() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('get/:id')
  async getUser(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @ApiBody({ type: CreateUserDto })
  @Post('/create')
  async createUser(@Body() createUser: CreateUserDto) {
    console.log(createUser);
    return await this.userService.createUser(createUser);
  }

  @ApiBody({ type: CreateUserDto })
  @Post('test')
  test(@Body() createUser: CreateUserDto): string {
    console.log(createUser.email);
    return 'asf';
  }
}

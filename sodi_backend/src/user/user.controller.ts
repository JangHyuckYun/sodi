import {
  Bind,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.create.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { Express, Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDuplicateRequestDto } from './dto/user.duplicate.request.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { BoardService } from '../board/board.service';
import { UserModifyDto } from './dto/user.modify.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly boardService: BoardService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('find')
  async getUser(@Req() req) {
    const { user } = req;
    const result = this.userService.find(user);
    console.log('result', result);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('find/board')
  async getBoards(@Req() req) {
    const {
      user: { sub },
    } = req;

    return this.boardService.findByUserid(Number(sub));
  }

  @UseGuards(JwtAuthGuard)
  @Post('list/all')
  async getAllUser() {
    return this.userService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/duplicate')
  async duplicate(@Body() userDuplicateReqDto: UserDuplicateRequestDto) {
    return this.userService.duplicate(userDuplicateReqDto);
  }

  @Post('/modify')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(UploadedFiles())
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() modifyUser: UserModifyDto,
  ) {
    console.log(modifyUser, files);
    return await this.userService.modifyUser(modifyUser, files);
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

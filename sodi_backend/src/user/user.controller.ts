import {
  Bind,
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.create.dto';
import { ApiBody } from '@nestjs/swagger';
import { Express } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDuplicateRequestDto } from './dto/user.duplicate.request.dto';
import { BoardService } from '../board/board.service';
import { UserModifyDto } from './dto/user.modify.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly boardService: BoardService,
  ) {}

  @Post('find')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req) {
    console.log('user -> req', req);
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
  // user.controller.ts
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

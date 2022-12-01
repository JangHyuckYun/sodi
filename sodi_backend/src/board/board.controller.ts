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
} from '@nestjs/common';
import { CreateBoardDto } from './dto/board.create.dto';
import { BoardService } from './board.service';
import { Board } from './board.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Express } from 'express';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('list/all')
  async allBoardList(@Req() req): Promise<Board[]> {
    const result = this.boardService.findAll();
    console.log('findAll', result, req);
    return result;
  }

  @Get('list/:boardIdx')
  async boardListById(@Param('boardIdx') boardIdx: number): Promise<Board> {
    return this.boardService.findOne(boardIdx);
  }

  @Post('create')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(UploadedFiles())
  @UseGuards(JwtAuthGuard)
  createBoard(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createBoardDto: CreateBoardDto,
    @Req() req,
  ) {
    createBoardDto.userId = req?.user?.id;

    const result = files.map((file) => {
      // const path = file.path.replace(this.config.get('ATTACH_SAVE_PATH'), '');
      console.log('file', file);
      return {
        filesName: file.originalname,
        // savedPath: path.replace(/\\/gi, '/'),
        size: file.size,
      };
    });
    this.boardService.createBoard(createBoardDto, files);
  }
}

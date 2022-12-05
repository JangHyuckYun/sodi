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
  async allBoardList(@Req() req): Promise<Array<any>> {
    const result = (await this.boardService.findAll()).map((board) => {
      const boardResult = Object.keys(board).reduce(
        (acc, key) => {
          if (key.includes('image')) {
            if (board[key]?.length > 0) acc.images.push(board[key]);
          } else {
            acc[key] = board[key];
          }
          return acc;
        },
        { images: [] },
      );
      return boardResult;
    });

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
    console.log();
    console.log('req?.user?.id', req?.user?.sub);
    createBoardDto.userId = Number(req?.user?.sub ?? -1);

    const result = files.map((file) => {
      return {
        filesName: file.originalname,
        size: file.size,
      };
    });
    this.boardService.createBoard(createBoardDto, files);
  }
}

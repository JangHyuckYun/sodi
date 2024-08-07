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
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { BoardUpdateDto } from './dto/board.update.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('list/all')
  async allBoardList(@Req() req): Promise<Array<any>> {
    return await this.boardService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('list/:boardIdx')
  async boardListById(@Param('boardIdx') boardIdx: number): Promise<Board> {
    return this.boardService.findOne(boardIdx);
  }

  @UseGuards(JwtAuthGuard)
  @Post('hits/:boardId')
  async hits(@Param('boardId') boardId: number, @Req() req): Promise<Board> {
    console.log(req.user);
    return this.boardService.updateHits(boardId, Number(req?.user?.sub));
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
    createBoardDto.userId = Number(req?.user?.sub ?? -1);
    this.boardService.createBoard(createBoardDto, files);
  }

  @Post('post/update')
  @UseGuards(JwtAuthGuard)
  async updateBoard(@Req() req, @Body() boardUpdateDto: BoardUpdateDto) {
    return await this.boardService.updateBoard(boardUpdateDto);
  }

  @Post('post/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBoard(@Req() req, @Param() boardId: number) {
    return await this.boardService.delete(boardId);
  }
}

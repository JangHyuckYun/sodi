import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/board.create.dto';
import { BoardService } from './board.service';
import { Board } from './board.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('list/all')
  async allBoardList(): Promise<Board[]> {
    const result = this.boardService.findAll();
    console.log('findAll', result);
    return result;
  }

  @Get('list/:boardIdx')
  async boardListById(@Param('boardIdx') boardIdx: number): Promise<Board> {
    return this.boardService.findOne(boardIdx);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('files'))
  createBoard(
    @UploadedFiles() files,
    @Body() createBoardDto: CreateBoardDto,
  ): void {
    console.log('createBoardDto', createBoardDto);
    console.log('images', files);
    // let result = {
    //   fileName: file.originalname,
    //   savedPath: path.replace(/\\/gi, '/'),
    //   size: file.size,
    // };
    // this.boardService.createBoard(createBoardDto);
  }
}

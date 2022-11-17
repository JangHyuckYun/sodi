import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateBoardDto } from './dto/board.create.dto';
import { BoardService } from './board.service';
import { Board } from './board.entity';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('list/all')
  async allBoardList(): Promise<Board[]> {
    return this.boardService.findAll();
  }

  @Get('list/:boardIdx')
  async boardListById(@Param('boardIdx') boardIdx: number): Promise<Board> {
    return this.boardService.findOne(boardIdx);
  }

  @Post('create')
  createBoard(@Body() createBoardDto: CreateBoardDto): void {
    this.boardService.createBoard(createBoardDto);
  }
}

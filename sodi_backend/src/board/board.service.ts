import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/board.create.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async createBoard(createBoardDto: CreateBoardDto) {
    return this.boardRepository.createBoard(createBoardDto);
  }

  async findAll(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async findOne(boardIdx: number) {
    return this.boardRepository.findOne({ where: { id: boardIdx } });
  }
}

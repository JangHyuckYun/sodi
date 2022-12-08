import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/board.create.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    files: Array<Express.Multer.File>,
  ) {
    createBoardDto.images = JSON.stringify(
      files?.map((file, idx) => files[idx].filename),
    );

    return this.boardRepository.createBoard(createBoardDto);
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  async findOne(boardIdx: number) {
    return this.boardRepository.findOne({ where: { id: boardIdx } });
  }

  async findByUserid(userId: number) {
    return this.boardRepository.findBy({ userId });
  }
}

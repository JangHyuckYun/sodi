import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/board.create.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { BoardUpdateDto } from './dto/board.update.dto';

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

  async updateHits(boardId: number, userId: number) {
    const board: Board = await this.boardRepository.findOneBy({
      id: boardId,
    });
    console.log(Number(board.userId), userId);
    if (Number(board.userId) !== userId) {
      board.hits = Number(board.hits) + 1;
      await this.boardRepository.save(board);
    }

    return null;
  }

  async updateBoard(boardUpdateDto: BoardUpdateDto) {
    const board = this.boardRepository.create({ ...boardUpdateDto });
    return await this.boardRepository.save(board);
  }

  async delete(boardId: number) {
    return await this.boardRepository.delete(boardId);
  }
}

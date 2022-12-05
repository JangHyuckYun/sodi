import { Repository } from 'typeorm';
import { CustomRepository } from '../database/typeorm-ex.decorator';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/board.create.dto';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  /** board Table -> 유저 생성  */
  async createBoard(createBoardDto: CreateBoardDto): Promise<any> {
    const board = this.create({ ...createBoardDto });

    return await this.save(board);
  }

  async findById(boardId: number): Promise<any> {
    return await this.findOne({
      where: { id: boardId },
    });
  }

  // async findByEmail(username: string) {
  //   return await this.findOne({
  //     where: { email: username },
  //   });
  // }

  /** board Table -> 조회수 증가 */
  async updateHitsById(id: number) {
    const boardNew = await this.findOne({ where: { id: id } });
    boardNew.hits = boardNew.hits + 1;
    await this.save(boardNew);

    return boardNew.id;
  }

  /** board Table -> 좋아요 수 증가 */
  async updateLikesById(id: number) {
    const boardNew = await this.findOne({ where: { id: id } });
    boardNew.likes = boardNew.likes + 1;
    await this.save(boardNew);

    return boardNew.id;
  }
}

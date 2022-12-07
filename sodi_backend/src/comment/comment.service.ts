import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentRepository } from './comment.repository';
import { Board } from '../board/board.entity';
import { BoardRepository } from '../board/board.repository';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly boardRepository: BoardRepository,
  ) {}
  async createComment(createCommentDto: CreateCommentDto) {
    const board: Board = await this.boardRepository.findById(
      createCommentDto.boardId,
    );
    createCommentDto.board = board;

    return this.commentRepository.createComment(createCommentDto);
  }

  async findAllByBoardId(boardId: number): Promise<Comment[]> {
    const board: Board = await this.boardRepository.findOne({
      where: { id: boardId },
      relationLoadStrategy: 'join',
      relations: ['comments'],
      order: {
        comments: {
          groupNum: 'ASC',
          order: 'ASC',
          depth: 'ASC',
        },
      },
    });

    // const comments: Comment[] = await board.comments;
    console.log('board', board);
    console.log('comments', board.comments);

    return board.comments;
  }
}

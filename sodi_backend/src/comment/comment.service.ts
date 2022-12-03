import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentRepository } from './comment.repository';
import { Board } from '../board/board.entity';
import { BoardRepository } from '../board/board.repository';

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

    console.log('board', board);
    createCommentDto.board = board;
    return this.commentRepository.createComment(createCommentDto);
  }
}

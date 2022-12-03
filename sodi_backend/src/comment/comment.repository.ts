import { CustomRepository } from '../database/typeorm-ex.decorator';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { BoardRepository } from '../board/board.repository';

@CustomRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(createCommentDto: CreateCommentDto) {
    delete createCommentDto.boardId;
    const comment = this.create({
      ...createCommentDto,
    });

    return await this.save(comment);
  }
}

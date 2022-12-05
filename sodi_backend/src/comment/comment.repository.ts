import { CustomRepository } from '../database/typeorm-ex.decorator';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { BoardRepository } from '../board/board.repository';

@CustomRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(createCommentDto: CreateCommentDto) {
    // delete createCommentDto.boardId;
    console.log('createCommentDto', createCommentDto);
    const comment = this.create({
      ...createCommentDto,
    });

    if (createCommentDto.replyName.length > 0) {
      const replyComment: Comment = await this.findOneBy({
        writer: createCommentDto.replyName,
        id: createCommentDto.replyId,
      });

      // const lastOrderComment: Comment[] = await this.find({
      //   select: {
      //     order: true,
      //   },
      //   where: {
      //     groupNum: replyComment.groupNum,
      //     id: createCommentDto.replyId,
      //   },
      //   order: {
      //     order: 'DESC',
      //   },
      // });
      const lastOrderComment = this.createQueryBuilder()
        .subQuery()
        .select(['comment.order'])
        .from(Comment, 'comment')
        .where('comment.groupNum = :groupNum AND comment.id != :id', {
          groupNum: replyComment.groupNum,
          id: replyComment.id,
        })
        .orderBy('comment.order DESC');

      console.log('lastOrderComment', lastOrderComment);

      comment.depth = replyComment.depth + 1;
      comment.groupNum = replyComment.groupNum;
      comment.order = lastOrderComment[0].order + 1;
    } else {
      const lastGroupComment = await this.find({
        order: {
          groupNum: 'DESC',
        },
        take: 1,
      });

      console.log('lastGroupComment', lastGroupComment);
      if (lastGroupComment.length > 0) {
        comment.groupNum = lastGroupComment[0].groupNum + 1;
      }
    }

    return await this.save(comment);
  }
}

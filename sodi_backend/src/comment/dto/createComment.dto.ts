import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { errorMessages } from '../../utils/errorMessages';
import { Board } from '../../board/board.entity';

const messages = errorMessages.kr.createComment;

export class CreateCommentDto {
  @IsNotEmpty({ message: 'boardId|' + messages.empty.boardId })
  boardId: number;

  board?: Board;

  @ApiProperty({ type: Number, description: '유저 아이디', default: 1 })
  userId?: number;

  @ApiProperty({
    type: String,
    description: '상위 댓글 작성자 이름',
    default: '',
  })
  replyName: '';

  @ApiProperty({
    type: Number,
    description: '상위 댓글 작성자 댓글 idx',
  })
  replyId?;

  @ApiProperty({ type: String, description: '유저 이름', default: '' })
  writer?: string;

  @ApiProperty({
    type: String,
    description: '댓글 내용',
    default: 'asfafsafsa',
  })
  @IsNotEmpty({ message: '이름|' + messages.empty.comment })
  content: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { errorMessages } from '../../utils/errorMessages';

const messages = errorMessages.kr.createBoard;

export class CreateBoardDto {
  @ApiProperty({
    type: Number,
    description: '게시글 작성한 유저의 idx',
    default: 5,
  })
  userId = -1;

  @ApiProperty({
    type: String,
    description: '게시글 제목',
    default: 'TEST - TITLE 1',
  })
  @IsNotEmpty({ message: messages.empty.title })
  title = '';

  @ApiProperty({
    type: String,
    description: '게시글 내용',
    default: 'TEST - CONTENT loreamloremloreamloremloreamlorem',
  })
  @IsNotEmpty({ message: messages.empty.content })
  content = '';

  @ApiProperty({
    type: String,
    description: '나라',
    default: 'TEST - CONTENT loreamloremloreamloremloreamlorem',
  })
  @IsNotEmpty({ message: messages.empty.content })
  country = '';

  @ApiProperty({
    type: Number,
    description: '게시글 조회수',
    default: 0,
  })
  hits = 0;

  @ApiProperty({
    type: Number,
    description: '게시글 좋아요 수',
    default: 0,
  })
  likes = 0;

  @ApiProperty({
    type: Array,
    description: '게시글의 이미지 리스트',
  })
  images: Array<string> = [];
  //
  // @ApiProperty({
  //   type: String,
  //   description: '게시글의 이미지 1',
  // })
  // image1 = '';
  //
  // @ApiProperty({
  //   type: String,
  //   description: '게시글의 이미지 2',
  // })
  // image2 = '';
  //
  // @ApiProperty({
  //   type: String,
  //   description: '게시글의 이미지 3',
  // })
  // image3 = '';
  //
  // @ApiProperty({
  //   type: String,
  //   description: '게시글의 이미지 4',
  // })
  // image4 = '';
  //
  // @ApiProperty({
  //   type: String,
  //   description: '게시글의 이미지 5',
  // })
  // image5 = '';

  // @ApiProperty({
  //   type: String,
  //   description: '댓글 리스트',
  // })
  // commentList: Comment[];
}

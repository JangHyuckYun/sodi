import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/list/:boardId')
  async findAllList(@Param('boardId') boardId: number) {
    return await this.commentService.findAllByBoardId(boardId);
  }

  @Post('/create')
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    console.log('asfsaf');
    console.log('createCommentDto', createCommentDto);
    console.log('req.user', req.user);
    const { sub, name } = req.user;
    createCommentDto.userId = sub;
    createCommentDto.writer = name;
    await this.commentService.createComment(createCommentDto);
  }
}

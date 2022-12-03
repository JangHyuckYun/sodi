import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    console.log('createCommentDto', createCommentDto);
    console.log(req.user);
    await this.commentService.createComment(createCommentDto);
  }
}

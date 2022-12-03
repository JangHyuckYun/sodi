import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { BoardRepository } from '../board/board.repository';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    TypeOrmExModule.forCustomRepository([BoardRepository, CommentRepository]),
  ],
  controllers: [CommentController],
  providers: [CommentService, JwtService],
  exports: [
    TypeOrmModule,
    TypeOrmExModule.forCustomRepository([BoardRepository, CommentRepository]),
  ],
})
export class CommentModule {}

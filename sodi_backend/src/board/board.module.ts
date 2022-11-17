import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './board.entity';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { BoardRepository } from './board.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BoardRepository]),
    TypeOrmModule.forFeature([Board]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [TypeOrmModule],
})
export class BoardModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/user.create.dto';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { JwtService } from '@nestjs/jwt';
import { BoardService } from '../board/board.service';
import { BoardRepository } from '../board/board.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, BoardRepository]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, BoardService],
  exports: [UserService],
})
export class UserModule {}

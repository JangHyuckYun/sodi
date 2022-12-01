import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { StudyModule } from './study/study.module';
import { BoardController } from './board/board.controller';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BoardService } from './board/board.service';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { BoardRepository } from './board/board.repository';
import { UserRepository } from './user/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mariadb',
        // host: config.get('DB_HOST_LOCAL'),
        host: config.get('DB_HOST_GLOBAL'),
        port: config.get('DB_HOST_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [config.get('ENTITY_PATH')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    StudyModule,
    BoardModule,
    CommentModule,
    // LoginModule,
    AuthModule,
    TypeOrmExModule.forCustomRepository([UserRepository, BoardRepository]),
  ],
  controllers: [AppController, BoardController, UserController, AuthController],
  providers: [
    AppService,
    AuthService,
    BoardService,
    JwtService,
    // StudyService,
    // BoardService,
    // UserService,
    // {
    //   provide: APP_GUARD,
    //   userClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}

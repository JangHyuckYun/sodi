import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './board.entity';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { BoardRepository } from './board.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { config } from 'rxjs';
import * as fs from 'fs';
import { extname } from 'path';
import { format } from 'light-date';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BoardRepository]),
    TypeOrmModule.forFeature([Board]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        storage: diskStorage({
          destination: function (req, file, cb) {
            // 파일저장위치 + 년월 에다 업로드 파일을 저장한다.
            // 요 부분을 원하는 데로 바꾸면 된다.
            const dest = `${config.get('ATTACH_SAVE_PATH')}/${format(
              new Date(),
              '{yyyy}{MM}',
            )}/`;

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            cb(null, dest);
          },
          filename: (req, file, cb) => {
            // 업로드 후 저장되는 파일명을 랜덤하게 업로드 한다.(동일한 파일명을 업로드 됐을경우 오류방지)
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [TypeOrmModule],
})
export class BoardModule {}

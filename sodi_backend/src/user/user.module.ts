import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/user.create.dto';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BoardService } from '../board/board.service';
import { BoardRepository } from '../board/board.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { format } from 'light-date';
import * as fs from 'fs';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, BoardRepository]),
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      imports: [ConfigModule, JwtModule],
      inject: [ConfigService, JwtService],
      useFactory: async (config: ConfigService, jwtService: JwtService) => ({
        storage: diskStorage({
          destination: function (req: any, file, cb) {
            function validateToken(token: string) {
              const secretKey = process.env.JWT_SECRET
                ? process.env.JWT_SECRET
                : 'dev';

              try {
                const verify = jwtService.verify(token, {
                  secret: secretKey,
                });
                // throw new HttpException('INVALID_TOKEN', 401);
                console.log('verify', verify);
                return verify;
              } catch (e) {
                console.log('error....', e);
                switch (e.message) {
                  // 토큰에 대한 오류를 판단합니다.
                  case 'INVALID_TOKEN':
                  case 'TOKEN_IS_ARRAY':
                  case 'NO_USER':
                    throw new HttpException('유효하지 않은 토큰입니다.', 401);

                  case 'EXPIRED_TOKEN':
                    throw new HttpException('토큰이 만료되었습니다.', 410);

                  default:
                    throw new HttpException('서버 오류입니다.', 500);
                }
              }
            }
            const { authorization } = req.headers;
            if (authorization === undefined) {
              throw new HttpException(
                'Token 전송 안됨',
                HttpStatus.UNAUTHORIZED,
              );
            }
            const token = authorization.replace('Bearer ', '');
            req.user = validateToken(token);
            const dest = `${config.get('ATTACH_SAVE_PATH_WINDOW')}/user/${
              req.user.sub + '' ?? ''
            }/`;
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
            cb(null, dest);
          },
          filename: (req, file, cb) => {
            console.log('asfasf');
            // 업로드 후 저장되는 파일명을 랜덤하게 업로드 한다.(동일한 파일명을 업로드 됐을경우 오류방지)
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, BoardService],
  exports: [UserService, MulterModule],
})
export class UserModule {}

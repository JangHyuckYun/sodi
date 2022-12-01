import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from '../user/dto/user.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
// import * as dotenv from 'dotenv';
//
// dotenv.config();
/*
 * jwt.strategy.ts 코드는 Guard 의 전략을 담은 코드로 Strategy 내부의 validate 함수가 실행되면서 인증 절차를 거치게 된다.
 * */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Request에서 JWT를 추출하는 방법 중 Bearer Token 사용
      ignoreExpiration: false, // jwt 보증을 passport 모듈에 위임함. 만료된 JWT인경우 request거부, 401 response
      secretOrKey: '' + configService.get<string>('JWT_SECRET'), // token 발급에 사용할 시크릿 키
    });
  }

  async validate(payload: any) {
    const userId = Number(payload.sub);
    const user: User = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

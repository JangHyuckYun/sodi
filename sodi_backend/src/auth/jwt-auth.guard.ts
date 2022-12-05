import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // // Add your custom authentication logic here
    // // for example, call super.logIn(request) to establish a session.
    //
    // const isPublic = this.reflector.getAllAndOverride<boolean>(
    //   process.env.JWT_SECRET,
    //   [context.getHandler(), context.getClass()],
    // );
    // if (isPublic) {
    //   return true;
    // }
    //
    // return super.canActivate(context);
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (authorization === undefined) {
      throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }

    console.log('authorization', authorization);

    const token = authorization.replace('Bearer ', '');

    request.user = this.validateToken(token);
    return true;
  }

  validateToken(token: string) {
    const secretKey = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'dev';

    try {
      const verify = this.jwtService.verify(token, { secret: secretKey });
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

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

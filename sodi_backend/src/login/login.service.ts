import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { randomUUID } from 'crypto';
import { Cache } from 'cache-manager';

@Injectable()
export class LoginService {
  //constructor() {} // @Inject() private userRepository: UserRepository, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  // login(email: string, password: string) {
  //   console.log(email, password);
  //   if (email === 'test@test.com' && password === 'test') {
  //     const payload = { email: email, username:  };
  //     return this.jwtService.sign(payload);
  //   }
  //   throw new UnauthorizedException('인증되지 않은 사용자입니다.');
  // }
  // public async login(id: string, pw: string) {
  //   const user = await this.userRepository.findByEmailAndPassword(id, pw);
  //   if (!user) {
  //     throw new NotFoundException('User is undefined');
  //   }
  //   const uuid = this.setUserCache(id);
  //   return uuid;
  // }
  //
  // public async setUserCache(id: string) {
  //   const uuid = randomUUID();
  //   try {
  //     await this.cacheManager.set(id, uuid);
  //   } catch (e) {
  //     throw new InternalServerErrorException('CacheServer Error');
  //   }
  //   return uuid;
  // }
}

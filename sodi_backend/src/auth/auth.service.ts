import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './jwt.payload';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(username);

    if (!user) return null;

    if (await bcrypt.compare(password, user?.password)) {
      // user.password === password
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    // const payload = Object.assign({}, Payload(user.email, user.name));
    const payload: Payload = {
      email: user.email,
      sub: user.id,
    };

    const result = {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
      }),
    };
    console.log('async login() -> after', result);
    return result;
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }
}

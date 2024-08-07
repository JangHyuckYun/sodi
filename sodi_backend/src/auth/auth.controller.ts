import {
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthExceptionFilter } from '../exception/auth.exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/test')
  async test(@Request() req) {
    return 'asf';
  }

  @UseFilters(AuthExceptionFilter)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/verify')
  async verify(@Request() req) {
    console.log('connect...', req.accessToken);
    return this.authService.verify(req.accessToken);
  }
}

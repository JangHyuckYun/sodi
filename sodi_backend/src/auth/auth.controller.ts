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

@UseGuards(LocalAuthGuard)
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
    console.log('connect...', req, req.user);
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verify')
  async verify(@Request() req) {
    console.log('connect...', req, req.accessToken);
    return this.authService.verifyToken(req.accessToken);
  }
}

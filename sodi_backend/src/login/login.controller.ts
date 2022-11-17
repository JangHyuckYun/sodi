import { Body, Controller, Post, Req } from '@nestjs/common';
import { LoginService } from './login.service';
import { Request } from 'express';
import { ApiBody } from '@nestjs/swagger';

@Controller('login')
export class LoginController {
  // constructor(private readonly loginService: LoginService) {}
  //
  // @ApiBody({ description: 'asf' })
  // @Post()
  // login(@Req() request) {
  //   const { email, password } = request.body;
  //   return this.loginService.login(email, password);
  // }
}

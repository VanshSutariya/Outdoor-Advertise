import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response, response } from 'express';
import { log } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);
    console.log(token);
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 1); // 1 day
    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires: expirationTime,
    });
    return { ...token };
  }
}

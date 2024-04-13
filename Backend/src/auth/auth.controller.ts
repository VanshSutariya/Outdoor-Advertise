import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response, response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.authService.getUsersById(id);
  }

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<Response> {
    const token = await this.authService.login(loginDto);
    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + 60 * 60 * 1000);
    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires: expirationTime,
    });
    return response.json({ ...token });
  }
}

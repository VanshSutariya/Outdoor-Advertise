import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response, response } from 'express';
import { emailDto } from './dto/email.dto';
import { EmailService } from './email.service';
import { UpdatePassDto, resetDto } from './dto/resetPass.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

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

  @Post('/forget-password')
  async sendEmail(
    @Body() data: emailDto,
  ): Promise<{ message: string } | { error: string }> {
    try {
      return await this.emailService.sendEmail(data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('/reset-password')
  async resetPass(@Body() resetInfo: resetDto) {
    return this.authService.resetpass(resetInfo);
  }

  @Patch('/update-password')
  async updatePassword(@Body() updatePassDto: UpdatePassDto) {
    return this.authService.updatepassword(updatePassDto);
  }
}

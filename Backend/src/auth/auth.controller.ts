import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, UpdateDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response, response } from 'express';
import { emailDto } from './dto/email.dto';
import { EmailService } from './email.service';
import { UpdatePassDto, resetDto } from './dto/resetPass.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Get()
  async getAllUser(@Query() query: ExpressQuery) {
    return await this.authService.getAllUsers(query);
  }

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

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updatedto: UpdateDto) {
    const up = this.authService.updateUserDetails(id, updatedto);
    return up;
  }

  @Put('/reset-password')
  async resetPass(@Body() resetInfo: resetDto) {
    return this.authService.resetpass(resetInfo);
  }

  @Put('/updatePassword')
  async updatepassword(@Body() updatePassDto: UpdatePassDto) {
    try {
      const result = await this.authService.updatepassword(updatePassDto);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

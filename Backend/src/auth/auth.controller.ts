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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, UpdateDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { emailDto } from './dto/email.dto';
import { EmailService } from './email.service';
import { UpdatePassDto, resetDto } from './dto/resetPass.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { RolesGuard } from 'src/RoleGuard/role.guard';
import { HasRoles } from 'src/RoleGuard/roles.decorater';
import { Roles } from './roles.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @HasRoles(Roles.admin)
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
    response.cookie('Authentication', token.token, {
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
    const up = await this.authService.updateUserDetails(id, updatedto);
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

  @Post('/upload/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Param('id') id: string,
    @Body() updatedto: UpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    const imageUrl: any = await this.authService.uploadImage(file.buffer);
    updatedto.image = imageUrl.secure_url;
    await this.authService.updateUserDetails(id, updatedto);
    return imageUrl;
  }
}

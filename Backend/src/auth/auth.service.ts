import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto, UpdateDto } from './dto/login.dto';
import { UpdatePassDto, resetDto } from './dto/resetPass.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Query } from 'express-serve-static-core';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getAllUsers(query: Query) {
    let DBQuery = {};

    if (query?.role) {
      DBQuery['role'] = {
        $regex: '^' + query?.role,
        $options: 'i',
      };
    }
    const resPerPage = Number(query?.per_page) || 0;
    const currPage = Number(query.page) || 1;
    const skip = resPerPage * (currPage - 1);
    return await this.userModel.find(DBQuery).limit(resPerPage).skip(skip);
  }

  async getUsersById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException('enter valid Userid.', 404);
    return user;
  }

  async updateUserDetails(id: string, updateDto: UpdateDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    if (!user) throw new HttpException('enter valid image or role.', 404);
    return user;
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;
    const newemail = await this.userModel.findOne({ email });
    if (newemail) throw new HttpException('Duplicate email not allowed', 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) throw new HttpException('enter valid Credentials.', 401);

    const token = this.jwtService.sign(
      { id: user._id },
      { expiresIn: process.env.JWT_EXPIRES, secret: process.env.JWT_SECRET },
    );

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email.');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password.');
    }
    const token = this.jwtService.sign(
      { id: user._id },
      { expiresIn: process.env.JWT_EXPIRES, secret: process.env.JWT_SECRET },
    );

    return { token };
  }

  async resetToken(
    userid: number,
    username: string,
  ): Promise<{ reset_token: string }> {
    const payload = {
      id: userid,
      username,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: process.env.JWT_SECRET,
    });
    return {
      reset_token: token,
    };
  }

  async resetpass(resetinfo: resetDto) {
    try {
      // Verify reset token
      const checkResetToken = jwt.verify(
        resetinfo.reset_token,
        process.env.JWT_SECRET,
      );

      const id: number = checkResetToken['id'] as unknown as number;

      // Hash the new password
      const hash = await bcrypt.hash(resetinfo.password, 10);

      // Update user password in the database
      const updatePassword = await this.userModel.findByIdAndUpdate(
        id,
        { password: hash },
        { new: true },
      );

      if (!updatePassword)
        throw new HttpException('Password is not updated. ', 404);

      // Return success message
      return {
        success: true,
        message: 'Successfully password has been updated',
      };
    } catch (error) {
      // Handle errors and return failure message
      console.error('Password reset failed:', error.message);
      return {
        success: false,
        message: 'Password reset failed. Please try again.',
      };
    }
  }

  async updatepassword(updatePassDto: UpdatePassDto) {
    try {
      const { email, currentPassword, newPassword } = updatePassDto;

      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new Error('Invalid email.');
      }
      const isPassCorrect = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPassCorrect) {
        throw new Error('Your Current Password is wrong.');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return {
        success: true,
        message: 'Successfully password has been updated',
      };
    } catch (error) {
      console.error('Password reset failed:', error.message);
      throw error;
    }
  }
}

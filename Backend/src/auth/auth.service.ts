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
import { Query } from 'express-serve-static-core';
import { v2 } from 'cloudinary';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {
    v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDNERY_KEY,
      api_secret: process.env.CLOUDNERY_SECRET_KEY,
    });
  }

  async getAllUsers(query: Query) {
    try {
      let DBQuery: any = {};

      if (query?.role) {
        DBQuery['role'] = {
          $regex: '^' + query?.role,
          $options: 'i',
        };
      }

      const resPerPage = Number(query?.per_page) || 0;
      const currPage = Number(query?.page) || 1;
      const skip = resPerPage * (currPage - 1);

      const result = await this.userModel
        .find(DBQuery)
        .limit(resPerPage)
        .skip(skip)
        .select('_id name email role image');

      const totalLength = await this.userModel.countDocuments(DBQuery);

      return { totalLength, result };
    } catch (error: any) {
      console.error('Error in getAllUsers:', error);
    }
  }

  async getUsersById(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('_id name email role image');
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
      { id: user._id, role: user.role, name: user.name },
      { expiresIn: process.env.JWT_EXPIRES, secret: process.env.JWT_SECRET },
    );

    return { token };
  }
  async googleLogin(token: string): Promise<{ token: string }> {
    const respLogin = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const response = await respLogin.json();

    let user = await this.userModel.findOne({ email: response.email });

    if (!user) {
      throw new UnauthorizedException('Please register first to login.');
    }

    const jwtToken = this.jwtService.sign(
      { id: user._id, role: user.role, name: user.name },
      { expiresIn: process.env.JWT_EXPIRES, secret: process.env.JWT_SECRET },
    );

    return { token: jwtToken };
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
      const checkResetToken = jwt.verify(
        resetinfo.reset_token,
        process.env.JWT_SECRET,
      );

      const id: number = checkResetToken['id'] as unknown as number;

      const hash = await bcrypt.hash(resetinfo.password, 10);

      const updatePassword = await this.userModel.findByIdAndUpdate(
        id,
        { password: hash },
        { new: true },
      );

      if (!updatePassword)
        throw new HttpException('Password is not updated. ', 404);

      return {
        success: true,
        message: 'Successfully password has been updated',
      };
    } catch (error) {
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

  async uploadImage(filepath: Buffer) {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { folder: 'UserProfileImages', resource_type: 'auto' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(filepath);
    });
  }
}

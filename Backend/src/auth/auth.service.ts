import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getUsersById(id: string) {
    const user = await this.userModel.findById(id);
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
}

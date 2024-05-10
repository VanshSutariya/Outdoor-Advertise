import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { emailDto } from './dto/email.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';

@Injectable()
export class EmailService {
  private transporter: any;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const emailConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    };

    // Check if the email configuration is provided
    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransport(emailConfig);
    } else {
      console.error('Email configuration is incomplete');
    }
  }

  async sendEmail(
    userEmail: emailDto,
  ): Promise<{ message: string } | { error: string }> {
    if (!this.transporter) {
      console.error('Email transporter is not initialized');
      return;
    }
    try {
      const email = userEmail.email;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new Error('Invalid email.');
      }

      const resetToken = await this.authService.resetToken(user._id, user.name);

      const mailOptions = {
        from: this.configService.get('EMAIL_USER'),
        to: email,
        subject: 'Token to reset your password',
        text: `I you want to reset your password then click on the given below link ,else ignore this email :: http://localhost:3000/resetPassword/${resetToken.reset_token}`,
      };

      await this.transporter.sendMail(mailOptions);

      return {
        message: 'Your reset token has been sent to your email successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}

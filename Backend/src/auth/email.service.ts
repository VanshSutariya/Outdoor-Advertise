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
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    };

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
        html: `
          <html>
          <head>
            <style>
              body {
                font-size: large;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                color: black; 
                text-align: center; 
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                text-align: left;
              }
              h2 {
                color: #333;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #fff !important; 
                background-color: #007BFF;
                border: none;
                border-radius: 5px;
                text-decoration: none;
                cursor: pointer;
              }
              .button:hover {
                background-color: #0056b3; 
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Reset Password</h2>
              <p><strong>If you want to reset your password, then click on the button below, else ignore this email.</strong></p>
              <a href="http://localhost:3000/outdoorAd/resetPassword/${resetToken.reset_token}" class="button">Reset Password</a>
            </div>
          </body>
          </html>
        `,
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

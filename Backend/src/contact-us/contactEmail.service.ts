import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactEmailService {
  private transporter: any;

  constructor(private readonly configService: ConfigService) {
    const emailConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
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
    email: string,
    subject: string,
    description: string,
  ): Promise<{ message: string } | { error: string }> {
    if (!this.transporter) {
      console.error('Email transporter is not initialized');
      return;
    }
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_USER'),
        to: 'sutariyavansh@gmail.com',
        subject: subject,
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
          margin:20px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: left;
          }
          h2 {
          color: #333;
              }
      </style>
      </head>
      <body>
      <div class="container">
      <h2>  ContactUs </h2>
      <p> Message : ${description}</p>
      <p> User Email: ${email}</p>
    </div>
  </body>
</html>
      `,
      };

      await this.transporter.sendMail(mailOptions);

      return {
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}

import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PosterDetailsModule } from './poster-details/poster-details.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { StripeController } from './stripe/stripe.controller';
import { StripeModule } from './stripe/stripe.module';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule,
    PosterDetailsModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
    CartModule,
    StripeModule,
    StripeWebhookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

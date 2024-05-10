import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PosterDetailsModule } from './poster-details/poster-details.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CartModule } from './cart/cart.module';
import { StripeModule } from './stripe/stripe.module';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';
import { BookingModule } from './booking/booking.module';
import { UserRoleChangeController } from './user-role-change/user-role-change.controller';
import { UserRoleChangeService } from './user-role-change/user-role-change.service';
import { UserRoleChangeModule } from './user-role-change/user-role-change.module';
import { GatewayModule } from './gateway/gateway.module';

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
    BookingModule,
    UserRoleChangeModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

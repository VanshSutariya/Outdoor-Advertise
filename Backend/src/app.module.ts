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
import { UserRoleChangeModule } from './user-role-change/user-role-change.module';
import { GatewayModule } from './gateway/gateway.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HttpMetricsInterceptor } from './metrics/metrics.intercepter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContactUsModule } from './contact-us/contact-us.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.Mongodb_Cluster),
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
    AuthModule,
    PosterDetailsModule,
    CartModule,
    StripeModule,
    StripeWebhookModule,
    BookingModule,
    UserRoleChangeModule,
    GatewayModule,
    PrometheusModule.register({
      defaultLabels: {
        application: 'outdoorAd',
      },
      defaultMetrics: {
        enabled: true,
      },
    }),
    ContactUsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpMetricsInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule {}

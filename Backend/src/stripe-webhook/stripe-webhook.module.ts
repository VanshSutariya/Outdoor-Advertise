import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeWebhookService } from './stripe-webhook.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schemas';
import { CartService } from 'src/cart/cart.service';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
import { PosterDetailsService } from 'src/poster-details/poster-details.service';
import {
  Posters,
  PostersSchema,
} from 'src/poster-details/schemas/posters.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { EmailService } from './bookingEmail.service';
import { BookingService } from 'src/booking/booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Posters.name, schema: PostersSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [StripeWebhookController],
  providers: [
    StripeWebhookService,
    CartService,
    BookingService,
    PosterDetailsService,
    EmailService,
  ],
})
export class StripeWebhookModule {}

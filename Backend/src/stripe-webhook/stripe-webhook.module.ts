import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeWebhookService } from './stripe-webhook.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schemas';
import { CartService } from 'src/cart/cart.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService, CartService],
})
export class StripeWebhookModule {}

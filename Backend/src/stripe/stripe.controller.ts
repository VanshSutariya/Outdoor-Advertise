import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';

interface Items {
  userId: string;
  totalPrice: number;
  image: string;
  title: string;
  _id: string;
}
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}
  @Post('/checkout')
  async createCheckoutSession(@Body() items: Items[]): Promise<string> {
    const sessionurl = await this.stripeService.createCheckoutSession(items);
    return sessionurl;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  async createCheckoutSession(items: any[]) {
    if (!items || items.length === 0) {
      throw new Error('No items provided for checkout.');
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: item.totalPrice * 100,
      },
      quantity: 1,
    }));

    const ids = items.map((item) => item._id);

    const metadata = {
      purchased_items: JSON.stringify(ids),
    };

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      metadata: metadata,
      success_url: 'http://localhost:3000/outdoorAd/success',
      cancel_url: 'http://localhost:3000/outdoorAd/cart',
    });
    // console.log('session', session);

    return session.url;
  }
}

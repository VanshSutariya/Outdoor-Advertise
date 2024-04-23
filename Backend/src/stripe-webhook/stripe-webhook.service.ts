import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartService } from 'src/cart/cart.service';
import { Stripe } from 'stripe';

@Injectable()
export class StripeWebhookService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private cartService: CartService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-04-10', // Specify the Stripe API version
    });
  }

  // async verifySignature(signature: string, body: string) {
  //   try {
  //     const event = this.stripe.webhooks.constructEvent(
  //       body,
  //       signature,
  //       process.env.STRIPE_WEBHOOK_SECRET,
  //     );
  //     return event;
  //   } catch (error) {
  //     console.log(error);

  //     throw new Error('Webhook signature verification failed');
  //   }
  // }
  async handleEvent(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful payment
        const session = event?.data?.object;
        const { metadata, mode, payment_intent, invoice } = session;
        console.log(
          'payment_intent ========================',
          metadata.purchased_items,
        );
        const cartId = JSON.parse(metadata.purchased_items);
        if (cartId && cartId.length > 0) {
          try {
            for (const itemId of cartId) {
              // Delete cart item based on purchased item ID
              await this.cartService.deleteCartById(itemId);
            }
            console.log('Cart items deleted successfully.');
          } catch (error) {
            console.error('Error deleting cart items:', error);
          }
        } else {
          console.log('No purchased item IDs found in metadata.');
        }

        // await this.handleSuccessfulPayment(event.data.object);
        break;
      // Add other event types as needed
      default:
        // Handle other event types or log unrecognized events
        console.log('Unhandled event type:', event.type);
    }
  }
  //   async handleSuccessfulPayment(paymentIntent: any) {
  //     // Implement logic to handle successful payment
  //     const userId = paymentIntent.metadata.userId;
  //     const dataId = paymentIntent.metadata.dataId;
  //     const totalPrice = paymentIntent.amount / 100; // Convert from cents to dollars

  //     // Example: Call a service to delete cart data and create booking schema
  //     // await this.cartService.deleteCart(userId);
  //     // await this.bookingService.createBooking(userId, dataId, totalPrice);
  //   }
}

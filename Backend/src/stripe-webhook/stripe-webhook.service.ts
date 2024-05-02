import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { BookingService } from 'src/booking/booking.service';
import { CartService } from 'src/cart/cart.service';
import { UpdatePosterDto } from 'src/poster-details/dto/updatePoster.dto';
// import { UpdatePosterDto } from 'src/poster-details/dto/updatePoster.dto';
import { PosterDetailsService } from 'src/poster-details/poster-details.service';
import { Stripe } from 'stripe';

@Injectable()
export class StripeWebhookService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private cartService: CartService,
    private bookingService: BookingService,
    private posterService: PosterDetailsService,
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
        const cartId = JSON.parse(metadata.purchased_items);
        if (cartId && cartId.length > 0) {
          try {
            for (const itemId of cartId) {
              // get cart data
              const cartItem = await this.cartService.getCartById(itemId);
              if (cartItem) {
                const filteredCartItem = {
                  userId: cartItem.userId,
                  posterId: cartItem.posterId,
                  title: cartItem.title,
                  image: cartItem.image,
                  address: cartItem.address,
                  totalPrice: cartItem.totalPrice,
                  createdBy: cartItem.createdBy,
                  bookingDate: cartItem.bookingDate,
                };

                const booking =
                  await this.bookingService.createBooking(filteredCartItem);
                if (!booking) {
                  console.log('booking failed----------', booking);
                  return;
                }

                // updating the booking dates in the posters-----------------------
                const updatePosterDto: UpdatePosterDto = {
                  bookingDate: cartItem.bookingDate, // Example array of booking dates
                };
                this.posterService.updatePoster(
                  cartItem.posterId,
                  updatePosterDto,
                );
                // Delete cart data-----------------------------
                const deleted = await this.cartService.deleteCartById(itemId);
                if (!deleted) {
                  console.log(
                    'cart items is not deleted or their is no items in the cart to delete.',
                  );
                  return;
                }
                console.log('Cart item deleted successfully:', cartId);
              } else {
                console.log('Cart item not found for ID:', cartId);
              }
            }
          } catch (error) {
            console.error('Error deleting cart items & booking orders:', error);
          }
        } else {
          console.log('No purchased item IDs found in metadata.');
        }
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
  }
}

import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { StripeWebhookService } from './stripe-webhook.service';
import Stripe from 'stripe';

@Controller('webhook')
export class StripeWebhookController {
  constructor(private webhookService: StripeWebhookService) {}
  @Post()
  async handleWebhookEvent(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      // console.log(typeof body, body);
      event = Stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );

      // Handle webhook event
      await this.webhookService.handleEvent(event);

      return { received: true };
    } catch (error) {
      // If verification fails, respond with error
      console.error(error);

      throw new BadRequestException('Webhook signature verification failed');
    }
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  RawBody,
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
    // @RawBody() body: string,
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

// @Post('/webhook')
//   async webhook(
//     @Headers('stripe-signature') signature: string,
//     @Req() req: RawBodyRequest<Request>,
//     @Res() res: Response,
//     // @Body() body: string,
//   ) {
//     let event: Stripe.Event;
//     try {
//       // const event = Stripe.webhooks.constructEvent(
//       //   'sk_test_51P3qGJSBKuIjnFPYL4D8MM6wiRCUaCaTlAwKlo60zrEkInNxC1GGWNGofvtLrQ03rYltStvo0SPgcYPhUvNu7uVy00J66YOpG6',
//       //   process.env.STRIPE_WEBHOOK_SECRET,
//       // // );
//       // const bodyBuffer = req.body as Buffer; // Assuming body is Buffer
//       // const bodyString = bodyBuffer.toString('utf-8');
//       // console.log('string===', bodyString);

//       // const header = req.headers["stripe-signature"]
//       // const response = await this.orderService.makeOreder(USERID,createOrderDto);

//       // console.log('First Call...==========.',req.body);
//       // console.log('signature Call....', typeof signature);

//       // const bodyString = req.body.toString('utf-8')

//       event = Stripe.webhooks.constructEvent(
//         req.rawBody,
//         // bodyString,
//         // payloadString,
//         signature,
//         'whsec_038f7ef276a4a05decf0717c242aabb2cd9f7b04821f6f3afe64f10711e7677c',
//       );

//       // event = Stripe.webhooks.constructEvent(body, signature, 'whsec_038f7ef276a4a05decf0717c242aabb2cd9f7b04821f6f3afe64f10711e7677c');
//       // const event = stripe.webhooks.constructEvent(
//       //   body,
//       //   sig,
//       //   'whsec_038f7ef276a4a05decf0717c242aabb2cd9f7b04821f6f3afe64f10711e7677c',
//       // );

//       // console.log('first-----',event);

//       if (event?.type === 'checkout.session.completed') {
//         const session = event?.data?.object;
//         const { metadata, mode, payment_intent, invoice } = session;
//         // console.log('payment_intent', invoice);
//         if (mode === 'payment') {
//           const response = await this.orderService.webhook(
//             metadata,
//             payment_intent,
//             invoice,
//           );
//         }

//         return res.status(HttpStatus.OK).json({ sucsses: true });
//       }
//       res.send().end();
//     } catch (error) {
//       console.log('err', error);
//       return res
//         .status(error.state || HttpStatus.BAD_REQUEST)
//         .json({ message: error.message });
//     }
//   }

import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';

import { ConfigService, CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly configService: ConfigService,
  ) {}

  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2025-07-30.basil',
  });

  async createCharge({ amount, currency, email, reservationId }: CreateChargeDto & { email: string; reservationId: string }) {
    const success_url = `${this.configService.get('STRIPE_SUCCESS_URL')}?reservationId=${reservationId}`;
    const cancel_url = `${this.configService.get('STRIPE_CANCEL_URL')}?reservationId=${reservationId}`;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Reservation Payment',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url,
      cancel_url,
      metadata: {
        email,
      },
    });

    return session;
  }

  async handleWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new ForbiddenException('Stripe webhook secret is not set');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent((req as any).rawBody, signature, webhookSecret);
    }
    catch (error) {
      throw new BadRequestException('Invalid signature', error);
    }
    switch (event.type) {
      case 'checkout.session.completed':
        {
          const session = event.data.object as Stripe.Checkout.Session;
          this.logger.log(`Payment completed for reservation: ${session.metadata?.reservationId}`);

          // TODO: Update reservation status to paid
        }
        break;
      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
        break;
    }

    res.sendStatus(200);
  }
}

import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { ConfigService, CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentsService {
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
}

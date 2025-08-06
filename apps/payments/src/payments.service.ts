import { BadRequestException, ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReservationStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import Stripe from 'stripe';

import { ConfigService, CreateChargeDto, NOTIFICATIONS_SERVICE, RESERVATIONS_SERVICE } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(RESERVATIONS_SERVICE) private readonly reservationsService: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy,
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
        reservationId,
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
          const reservationId = session.metadata?.reservationId || '07605416-0dd9-4034-8910-132fe14a8be2';
          const email = session.metadata?.email || 'john.doe@example.com';

          this.logger.log(`Payment completed for reservation: ${reservationId}`);

          if (!reservationId || !email) {
            this.logger.error('Missing reservation ID or email in webhook metadata');
            break;
          }

          try {
            const payload = {
              reservationId,
              status: ReservationStatus.PENDING_APPROVAL,
              email,
            };

            const signedMessage = this.configService.createSignedMessage(payload, 'payments');

            await firstValueFrom(
              this.reservationsService.send('update-reservation-status', signedMessage),
            );

            this.logger.log(`Reservation ${reservationId} status updated to PENDING_APPROVAL`);

            this.notificationsService.emit('notify_email', {
              email,
              text: 'Your reservation has been confirmed',
            });
          }
          catch (error) {
            this.logger.error(`Failed to update reservation status: ${error.message}`, error.stack);
          }
        }
        break;

      case 'checkout.session.expired':
        {
          const session = event.data.object as Stripe.Checkout.Session;
          const reservationId = session.metadata?.reservationId;
          const email = session.metadata?.email;

          this.logger.log(`Payment expired for reservation: ${reservationId}`);

          if (!reservationId || !email) {
            this.logger.error('Missing reservation ID or email in webhook metadata');
            break;
          }

          try {
            const payload = {
              reservationId,
              status: ReservationStatus.CANCELED,
              email,
            };

            const signedMessage = this.configService.createSignedMessage(payload, 'payments');

            await firstValueFrom(
              this.reservationsService.send('update-reservation-status', signedMessage),
            );

            this.logger.log(`Reservation ${reservationId} status updated to CANCELED due to payment expiration`);

            this.notificationsService.emit('notify_email', {
              email,
              text: 'Your reservation has been canceled due to payment expiration',
            });
          }
          catch (error) {
            this.logger.error(`Failed to update reservation status: ${error.message}`, error.stack);
          }
        }
        break;

      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
        break;
    }

    res.sendStatus(200);
  }
}

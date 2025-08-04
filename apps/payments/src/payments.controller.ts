import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateChargeDto, CreateChargeSchema, ZodPipe } from '@app/common';

import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create-checkout-session')
  @UsePipes(new ZodPipe(CreateChargeSchema))
  async createChargeFromMessage(@Payload() data: CreateChargeDto & { email: string; reservationId: string }) {
    const session = await this.paymentsService.createCharge(data);

    return { url: session.url };
  }

  @Post('charge')
  @UsePipes(new ZodPipe(CreateChargeSchema))
  async createChargeFromHttp(@Body() data: CreateChargeDto & { email: string; reservationId: string }) {
    const session = await this.paymentsService.createCharge(data);

    return { url: session.url };
  }

  @Get('cancel')
  async cancelCharge() {
    console.log('cancelCharge');

    return { message: 'Payment cancelled' };
  }

  @Get('success')
  async successCharge() {
    console.log('successCharge');

    return { message: 'Payment successful' };
  }
}

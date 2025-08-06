import { Controller, UsePipes } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { ZodPipe } from '@app/common';

import { NotifyEmailDto } from './dto';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ZodPipe(NotifyEmailDto))
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    await this.notificationsService.notifyEmail(data);
  }
}

import { Controller, Get, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('latest')
  getLast30(@Req() req: any) {
    return this.notificationsService.getLast30(req.user.accountId);
  }
}

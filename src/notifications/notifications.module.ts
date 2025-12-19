import { Module, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from '../prisma.service';
import { notificationEvents } from './observer/notification.subject';
import { DbNotificationObserver } from './observer/db-notification.observer';
import { PushNotificationObserver } from './observer/push-notification.observer';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
})
export class NotificationsModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    notificationEvents.attach(new DbNotificationObserver(this.prisma));
    notificationEvents.attach(new PushNotificationObserver());
  }
}

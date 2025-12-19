// notifications/observer/db-notification.observer.ts
import { NotificationObserver } from './observer.interface';
import { NotificationData } from '../push-notifications/notification.interface';
import { PrismaService } from '../../prisma.service';

export class DbNotificationObserver implements NotificationObserver {
  constructor(private readonly db: PrismaService) {}

   onNotificationSent(data: NotificationData) {
     this.db.notifications.create({
      data: {
        account_id: data.account_id,
        message: data.message,
        transaction_id: data.transaction_id,
      },
    });
  }
}

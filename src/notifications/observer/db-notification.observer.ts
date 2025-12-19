// notifications/observer/db-notification.observer.ts
import { NotificationObserver } from './observer.interface';
import { NotificationData } from '../push-notifications/notification.interface';
import { PrismaService } from '../../prisma.service';

export class DbNotificationObserver implements NotificationObserver {
  constructor(private readonly db: PrismaService) {}

  async onNotificationSent(
    data: NotificationData,
    channels: Array<'email' | 'sms' | 'whatsapp'>,
  ): Promise<void> {
    await this.db.notifications.create({
      data: {
        account_id: data.account_id,
        message: data.message,
        transaction_id: data.transaction_id,
      },
    });
  }
}

import { Notification, NotificationData } from '../notification.interface';

export class BaseNotification implements Notification {
  send(data: NotificationData): void {
    console.log(`Core logic for account: ${data.account_id}`);
  }
}

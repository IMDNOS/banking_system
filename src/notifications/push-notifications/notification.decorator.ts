import { Notification, NotificationData } from './notification.interface';

export abstract class NotificationDecorator implements Notification {
  constructor(protected readonly notification: Notification) {}

  send(data: NotificationData): void {
    this.notification.send(data);
  }
}

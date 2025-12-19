// notification.factory.ts
import { BaseNotification } from './concrete/base.notification';
import { EmailNotification } from './concrete/email.notification';
import { SmsNotification } from './concrete/sms.notification';
import { WhatsAppNotification } from './concrete/whatsapp.notification';
import { Notification } from './notification.interface';

export class NotificationFactory {
  static create(channels: Array<'email' | 'sms' | 'whatsapp'>): Notification {
    let notification: Notification = new BaseNotification();

    for (const channel of channels) {
      if (channel === 'email') {
        notification = new EmailNotification(notification);
      }
      if (channel === 'sms') {
        notification = new SmsNotification(notification);
      }
      if (channel === 'whatsapp') {
        notification = new WhatsAppNotification(notification);
      }
    }

    return notification;
  }
}

// whatsapp.notification-data.ts
import { NotificationDecorator } from '../notification.decorator';
import { NotificationData } from '../notification.interface';

export class WhatsAppNotification extends NotificationDecorator {
  send(data: NotificationData): void {
    super.send(data);
    console.log(`Sending Whatsapp message to ${data.phone_number}: ${data.message}`);
  }
}

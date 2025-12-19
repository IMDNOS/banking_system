import { NotificationData } from '../notification.interface';
import { NotificationDecorator } from '../notification.decorator';

export class SmsNotification extends NotificationDecorator {
  send(data: NotificationData): void {
    super.send(data);
    console.log(`Sending SMS to ${data.phone_number}: ${data.message}`);
  }
}

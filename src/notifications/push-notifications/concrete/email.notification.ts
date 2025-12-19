import { NotificationData } from '../notification.interface';
import { NotificationDecorator } from '../notification.decorator';

export class EmailNotification extends NotificationDecorator {
  send(data: NotificationData): void {
    super.send(data);
    console.log(`Sending Email to ${data.email}: ${data.message}`);
  }
}

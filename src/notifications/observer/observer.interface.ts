// notifications/observer/observer.interface.ts
import { NotificationData } from '../push-notifications/notification.interface';

export interface NotificationObserver {
  onNotificationSent(
    data: NotificationData,
    // methods:{email: boolean, sms: boolean, whatsapp: boolean}
    channels: Array<'email' | 'sms' | 'whatsapp'>,
  ): void;
}

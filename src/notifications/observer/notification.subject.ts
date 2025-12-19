// notifications/observer/notification.subject.ts
import { NotificationObserver } from './observer.interface';
import { NotificationData } from '../push-notifications/notification.interface';

export class NotificationSubject {
  private observers: NotificationObserver[] = [];

  attach(observer: NotificationObserver): void {
    this.observers.push(observer);
  }

  detach(observer: NotificationObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(
    data: NotificationData,
    channels: Array<'email' | 'sms' | 'whatsapp'>,
    // methods:{email: boolean, sms: boolean, whatsapp: boolean}
  ): void {
    for (const observer of this.observers) {
      observer.onNotificationSent(data, channels);
    }
  }
}

// ✅ global singleton
export const notificationEvents = new NotificationSubject();

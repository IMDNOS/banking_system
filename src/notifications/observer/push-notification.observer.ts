// notifications/observer/push-notification.observer.ts
import { NotificationObserver } from './observer.interface';
import { NotificationData } from '../push-notifications/notification.interface';
import { NotificationFactory } from '../push-notifications/notification.factory';

export class PushNotificationObserver implements NotificationObserver {
  onNotificationSent(
    data: NotificationData,
    // methods:{email: boolean, sms: boolean, whatsapp: boolean}
    channels: Array<'email' | 'sms' | 'whatsapp'>
  ): void {
   // const channels:Array<'email' | 'sms' | 'whatsapp'>=[]

    // if(methods.email) channels.push('email')
    // if(methods.sms) channels.push('sms')
    // if(methods.whatsapp) channels.push('whatsapp')


    const notifier = NotificationFactory.create(channels);
    notifier.send(data);
  }
}

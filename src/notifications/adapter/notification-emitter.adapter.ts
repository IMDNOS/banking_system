import { notificationEvents } from '../observer/notification.subject';
import { NotificationData } from '../push-notifications/notification.interface';
import { NotificationMethods } from './notification-methods.type';
import { NotificationChannelsAdapter } from './notification-channels.adapter';

export class NotificationEmitterAdapter {
  static notify(
    data: NotificationData,
    methods: NotificationMethods,
  ): void {
    const channels = NotificationChannelsAdapter.adapt(methods);
    notificationEvents.notify(data, channels);
  }
}


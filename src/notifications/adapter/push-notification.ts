import { NotificationData } from '../push-notifications/notification.interface';
import { NotificationMethods } from './notification-methods.type';
import { NotificationEmitterAdapter } from './notification-emitter.adapter';

export const PushNotification = (
  data: NotificationData,
  methods: NotificationMethods,
): void => {
  NotificationEmitterAdapter.notify(data, methods);
};
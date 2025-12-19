import { NotificationMethods } from './notification-methods.type';

export class NotificationChannelsAdapter {
  static adapt(
    methods: NotificationMethods,
  ): Array<'email' | 'sms' | 'whatsapp'> {
    const channels: Array<'email' | 'sms' | 'whatsapp'> = [];

    if (methods.email) channels.push('email');
    if (methods.sms) channels.push('sms');
    if (methods.whatsapp) channels.push('whatsapp');

    return channels;
  }
}

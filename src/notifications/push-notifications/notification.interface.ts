export type NotificationData = {
  account_id: string;
  email: string;
  phone_number: string;
  message: string;
  transaction_id: string;
}

export interface Notification {
  send(data: NotificationData): void; // Updated to accept data
}
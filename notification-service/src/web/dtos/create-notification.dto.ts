export class CreateNotificationDto {
  orderId: string;
  customerId: string;
  orderDescription: string;
  status: 'accepted' | 'declined';
  amount: number;
  paymentMethod: string;
  notificationType: 'email' | 'sms' | 'push';
}

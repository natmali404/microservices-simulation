export class Notification {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly orderDescription: string,
    public readonly status: 'accepted' | 'declined',
    public readonly notificationType: 'email' | 'sms' | 'push',
    public readonly amount?: number,
    public readonly paymentMethod?: string,
  ) {}
}

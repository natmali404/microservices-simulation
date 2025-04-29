export class NotificationResponseDto {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly description: string,
    public readonly status: 'accepted' | 'declined',
    public readonly notificationType: 'email' | 'sms' | 'push',
    public readonly amount?: number,
    public readonly paymentMethod?: string,
  ) {}
}

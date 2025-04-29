export class PaymentCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly orderDescription: string,
    public readonly status: string,
    //new fields
    public readonly amount: number,
    public readonly paymentMethod: string,
  ) {}
}

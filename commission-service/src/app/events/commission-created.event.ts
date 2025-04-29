export class CommissionCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly orderDescription: string,
    public readonly status: string,
  ) {}
}

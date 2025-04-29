export class PaymentUpdatedEvent {
  constructor(
    public readonly commissionId: string,
    public readonly newAmount: number,
    public readonly newPaymentMethod: string,
  ) {}
}

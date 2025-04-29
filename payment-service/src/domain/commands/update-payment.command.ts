export class UpdatePaymentCommand {
  constructor(
    public readonly paymentId: string,
    public readonly newAmount: number,
    public readonly newPaymentMethod: string,
  ) {}
}

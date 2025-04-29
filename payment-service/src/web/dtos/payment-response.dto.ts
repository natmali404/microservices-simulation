export class PaymentResponseDto {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly description: string,
    public readonly status: string,
    //new fields
    public readonly amount: number,
    public readonly paymentMethod: string,
  ) {}
}

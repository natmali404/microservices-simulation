export class CommissionResponseDto {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly description: string,
    public readonly status: string,
  ) {}
}

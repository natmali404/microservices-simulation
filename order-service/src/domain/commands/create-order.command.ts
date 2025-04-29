export class CreateOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly orderDescription: string,
  ) {}
}

export class Order {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly orderDescription: string,
  ) {}
}

// src/app/commands/update-order.command.ts
export class UpdateOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly newDescription: string,
  ) {}
}

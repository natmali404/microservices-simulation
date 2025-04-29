// src/app/events/order-updated.event.ts
export class OrderUpdatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly newDescription: string,
  ) {}
}

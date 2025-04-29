// src/app/events/order-deleted.event.ts
export class OrderDeletedEvent {
  constructor(public readonly orderId: string) {}
}

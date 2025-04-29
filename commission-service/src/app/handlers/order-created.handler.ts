import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { OrderCreatedEvent } from '../events/order-created.event';
import { CreateCommissionCommand } from '../../domain/commands/create-commission.command';
@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: OrderCreatedEvent) {
    const { orderId, customerId, orderDescription } = event;

    const status = Math.random() > 0.5 ? 'accepted' : 'declined';

    const command = new CreateCommissionCommand(
      orderId,
      customerId,
      orderDescription,
      status,
    );

    await this.commandBus.execute(command);
  }
}

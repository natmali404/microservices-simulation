// src/app/handlers/delete-order.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  OrderRepositoryInterface,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { DeleteOrderCommand } from '../../domain/commands/delete-order.command';
import { OrderDeletedEvent } from '../events/order-deleted.event';

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler implements ICommandHandler<DeleteOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    const exists = await this.repository.findById(command.orderId);
    if (!exists) throw new Error('Order not found');

    await this.repository.delete(command.orderId);
    this.eventBus.publish(new OrderDeletedEvent(command.orderId));
  }
}

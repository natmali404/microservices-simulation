// src/app/handlers/update-order.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Order } from '../../domain/entities/order.entity';
import { Inject } from '@nestjs/common';
import {
  OrderRepositoryInterface,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { UpdateOrderCommand } from '../../domain/commands/update-order.command';
import { OrderUpdatedEvent } from '../events/order-updated.event';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateOrderCommand): Promise<void> {
    const order = await this.repository.findById(command.orderId);
    if (!order) throw new Error('Order not found');

    const updatedOrder = new Order(
      order.orderId,
      order.customerId,
      command.newDescription,
    );

    await this.repository.save(updatedOrder);
    this.eventBus.publish(
      new OrderUpdatedEvent(command.orderId, command.newDescription),
    );
  }
}

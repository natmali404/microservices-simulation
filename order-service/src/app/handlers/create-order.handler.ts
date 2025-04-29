// src/application/handlers/create-order.handler.ts
import { Inject, Logger } from '@nestjs/common';
// src/application/handlers/create-order.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from '../../domain/entities/order.entity';
import {
  OrderRepositoryInterface,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { OrderCreatedEvent } from '../events/order-created.event';
import { CreateOrderCommand } from '../../domain/commands/create-order.command';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryInterface,
    @Inject('ORDERS_RABBITMQ_CLIENT')
    private readonly rabbitmqClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(CreateOrderHandler.name);

  async execute(command: CreateOrderCommand): Promise<void> {
    const order = new Order(
      command.orderId,
      command.customerId,
      command.orderDescription,
    );

    await this.repository.save(order);

    const event = new OrderCreatedEvent(
      order.orderId,
      order.customerId,
      order.orderDescription,
    );

    this.rabbitmqClient.emit('order.created', event);
    this.logger.log(`[OrderService] Event wysłany: ${JSON.stringify(event)}`);
  }
}

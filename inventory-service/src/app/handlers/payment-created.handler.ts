import { EventsHandler, IEventHandler, CommandBus } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Logger } from '@nestjs/common';

import { PaymentCreatedEvent } from '../events/payment-created.event';
import { FINAL_ORDER_REPOSITORY } from '../../domain/repositories/final-order.repository.interface';
import { FinalOrderRepository } from '../../infrastructure/persistence/final-order.repository';
import { FinalOrder } from '../../domain/entities/final-order.entity';
import { CreateFinalOrderCommand } from '../../domain/commands/create-final-order.command';

@EventsHandler(PaymentCreatedEvent)
export class PaymentCreatedHandler
  implements IEventHandler<PaymentCreatedEvent>
{
  private readonly logger = new Logger(PaymentCreatedHandler.name);

  constructor(
    @Inject(FINAL_ORDER_REPOSITORY)
    private readonly finalOrderRepository: FinalOrderRepository,
    @Inject('FINAL_ORDERS_RABBITMQ_CLIENT')
    private readonly rabbitmqClient: ClientProxy,
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {}

  async handle(event: PaymentCreatedEvent) {
    const {
      orderId,
      customerId,
      orderDescription,
      status,
      amount,
      paymentMethod,
    } = event;

    const finalOrder = new FinalOrder(
      orderId,
      customerId,
      orderDescription,
      status,
      amount,
      paymentMethod,
      false,
    );

    await this.finalOrderRepository.save(finalOrder);

    const command = new CreateFinalOrderCommand(
      orderId,
      customerId,
      orderDescription,
      status,
      amount,
      paymentMethod,
      false,
    );

    await this.commandBus.execute(command);

    this.logger.log(`[InventoryService] Finalizowanie zamówienia`);
  }
}

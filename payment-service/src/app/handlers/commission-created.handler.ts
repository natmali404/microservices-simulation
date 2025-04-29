import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

import { CommissionCreatedEvent } from '../events/commission-created.event';
import { PAYMENT_REPOSITORY } from '../../domain/repositories/payment.repository.interface';
import { PaymentRepository } from '../../infrastructure/persistence/payment.repository';
import { CreatePaymentCommand } from 'src/domain/commands/create-payment.command';

@EventsHandler(CommissionCreatedEvent)
export class CommissionCreatedHandler
  implements IEventHandler<CommissionCreatedEvent>
{
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async handle(event: CommissionCreatedEvent) {
    const { orderId, customerId, orderDescription, status } = event;

    //logika losowej wartosci
    const paymentMethod = Math.random() > 0.5 ? 'PayPal' : 'Credit Card';
    const amount = Math.floor(Math.random() * 100) + 1; // losowa kwota od 1 do 100

    const command = new CreatePaymentCommand(
      orderId,
      customerId,
      orderDescription,
      status,
      amount,
      paymentMethod,
    );

    await this.commandBus.execute(command);
  }
}

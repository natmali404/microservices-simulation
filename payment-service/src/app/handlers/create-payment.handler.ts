import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Payment } from '../../domain/entities/payment.entity';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import { CreatePaymentCommand } from '../../domain/commands/create-payment.command';
import { PaymentCreatedEvent } from '../events/payment-created.event';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentCommand>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repository: PaymentRepositoryInterface,
    @Inject('INVENTORY_SENDER_CLIENT')
    private readonly rabbitmqClientInventory: ClientProxy,
    @Inject('NOTIFICATION_SENDER_CLIENT')
    private readonly rabbitmqClientNotification: ClientProxy,
  ) {}
  private readonly logger = new Logger(CreatePaymentHandler.name);

  async execute(command: CreatePaymentCommand): Promise<void> {
    const payment = new Payment(
      command.orderId,
      command.customerId,
      command.orderDescription,
      command.status,
      command.amount,
      command.paymentMethod,
    );

    await this.repository.save(payment);

    const event = new PaymentCreatedEvent(
      command.orderId,
      command.customerId,
      command.orderDescription,
      command.status,
      command.amount,
      command.paymentMethod,
    );

    this.rabbitmqClientInventory.emit('order.paid', event);
    this.rabbitmqClientNotification.emit('order.paid', event);

    this.logger.log(
      `[PaymentService] Przetworzono płatność za zamówienie: ${JSON.stringify(event)}`,
    );
  }
}

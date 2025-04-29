import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Payment } from '../../domain/entities/payment.entity';
import { Inject } from '@nestjs/common';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import { UpdatePaymentCommand } from '../../domain/commands/update-payment.command';
// import { PaymentUpdatedEvent } from '../events/payment-updated.event';

@CommandHandler(UpdatePaymentCommand)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentCommand>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repository: PaymentRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdatePaymentCommand): Promise<void> {
    const payment = await this.repository.findById(command.paymentId);
    if (!payment) throw new Error('Payment not found');

    const updatedPayment = new Payment(
      payment.orderId,
      payment.customerId,
      payment.orderDescription,
      payment.status,
      command.newAmount,
      command.newPaymentMethod,
    );

    await this.repository.save(updatedPayment);
  }
}

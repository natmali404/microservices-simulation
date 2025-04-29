import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import { DeletePaymentCommand } from '../../domain/commands/delete-payment.command';
import { PaymentDeletedEvent } from '../events/payment-deleted.event';

@CommandHandler(DeletePaymentCommand)
export class DeletePaymentHandler
  implements ICommandHandler<DeletePaymentCommand>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repository: PaymentRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeletePaymentCommand): Promise<void> {
    const exists = await this.repository.findById(command.paymentId);
    if (!exists) throw new Error('Payment not found');

    await this.repository.delete(command.paymentId);
    this.eventBus.publish(new PaymentDeletedEvent(command.paymentId));
  }
}

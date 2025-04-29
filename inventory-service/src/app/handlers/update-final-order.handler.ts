import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { FinalOrder } from '../../domain/entities/final-order.entity';
import { Inject } from '@nestjs/common';
import {
  FinalOrderRepositoryInterface,
  FINAL_ORDER_REPOSITORY,
} from '../../domain/repositories/final-order.repository.interface';
import { UpdateFinalOrderCommand } from '../../domain/commands/update-final-order.command';
// import { FinalOrderUpdatedEvent } from '../events/finalOrder-updated.event';

@CommandHandler(UpdateFinalOrderCommand)
export class UpdateFinalOrderHandler
  implements ICommandHandler<UpdateFinalOrderCommand>
{
  constructor(
    @Inject(FINAL_ORDER_REPOSITORY)
    private readonly repository: FinalOrderRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateFinalOrderCommand): Promise<void> {
    const finalOrder = await this.repository.findById(command.finalOrderId);
    if (!finalOrder) throw new Error('FinalOrder not found');

    const updatedFinalOrder = new FinalOrder(
      finalOrder.orderId,
      finalOrder.customerId,
      finalOrder.orderDescription,
      finalOrder.status,
      finalOrder.amount,
      finalOrder.paymentMethod,
      command.newIsFinished,
    );

    await this.repository.save(updatedFinalOrder);
  }
}

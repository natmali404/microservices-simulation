import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  FinalOrderRepositoryInterface,
  FINAL_ORDER_REPOSITORY,
} from '../../domain/repositories/final-order.repository.interface';
import { DeleteFinalOrderCommand } from '../../domain/commands/delete-final-order.command';
import { FinalOrderDeletedEvent } from '../events/final-order-deleted.event';

@CommandHandler(DeleteFinalOrderCommand)
export class DeleteFinalOrderHandler
  implements ICommandHandler<DeleteFinalOrderCommand>
{
  constructor(
    @Inject(FINAL_ORDER_REPOSITORY)
    private readonly repository: FinalOrderRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteFinalOrderCommand): Promise<void> {
    const exists = await this.repository.findById(command.finalOrderId);
    if (!exists) throw new Error('FinalOrder not found');

    await this.repository.delete(command.finalOrderId);
    this.eventBus.publish(new FinalOrderDeletedEvent(command.finalOrderId));
  }
}

import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FinalOrder } from '../../domain/entities/final-order.entity';
import {
  FinalOrderRepositoryInterface,
  FINAL_ORDER_REPOSITORY,
} from '../../domain/repositories/final-order.repository.interface';
//import { FinalOrderCreatedEvent } from '../events/finalOrder-created.event';
import { CreateFinalOrderCommand } from '../../domain/commands/create-final-order.command';
import { InventoryTrackerService } from '../../domain/services/inventory-tracker.service';

@CommandHandler(CreateFinalOrderCommand)
export class CreateFinalOrderHandler
  implements ICommandHandler<CreateFinalOrderCommand>
{
  constructor(
    private readonly tracker: InventoryTrackerService,
    @Inject(FINAL_ORDER_REPOSITORY)
    private readonly repository: FinalOrderRepositoryInterface,
  ) {}

  async execute(command: CreateFinalOrderCommand): Promise<void> {
    const finalOrder = new FinalOrder(
      command.orderId,
      command.customerId,
      command.orderDescription,
      command.status,
      command.amount,
      command.paymentMethod,
      command.isFinished,
    );

    await this.repository.save(finalOrder);

    this.tracker.increment();
  }
}

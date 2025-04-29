import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Commission } from '../../domain/entities/commission.entity';
import { Inject } from '@nestjs/common';
import {
  CommissionRepositoryInterface,
  COMMISSION_REPOSITORY,
} from '../../domain/repositories/commission.repository.interface';
import { UpdateCommissionCommand } from '../../domain/commands/update-commission.command';
// import { CommissionUpdatedEvent } from '../events/commission-updated.event';

@CommandHandler(UpdateCommissionCommand)
export class UpdateCommissionHandler
  implements ICommandHandler<UpdateCommissionCommand>
{
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly repository: CommissionRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateCommissionCommand): Promise<void> {
    const commission = await this.repository.findById(command.commissionId);
    if (!commission) throw new Error('Commission not found');

    const updatedCommission = new Commission(
      commission.orderId,
      commission.customerId,
      commission.orderDescription,
      command.newStatus,
    );

    await this.repository.save(updatedCommission);
  }
}

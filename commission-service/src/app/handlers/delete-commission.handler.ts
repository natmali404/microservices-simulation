import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  CommissionRepositoryInterface,
  COMMISSION_REPOSITORY,
} from '../../domain/repositories/commission.repository.interface';
import { DeleteCommissionCommand } from '../../domain/commands/delete-commission.command';
import { CommissionDeletedEvent } from '../events/commission-deleted.event';

@CommandHandler(DeleteCommissionCommand)
export class DeleteCommissionHandler
  implements ICommandHandler<DeleteCommissionCommand>
{
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly repository: CommissionRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteCommissionCommand): Promise<void> {
    const exists = await this.repository.findById(command.commissionId);
    if (!exists) throw new Error('Commission not found');

    await this.repository.delete(command.commissionId);
    this.eventBus.publish(new CommissionDeletedEvent(command.commissionId));
  }
}

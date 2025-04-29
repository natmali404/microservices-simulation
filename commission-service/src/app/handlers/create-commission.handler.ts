import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { Commission } from '../../domain/entities/commission.entity';
import {
  CommissionRepositoryInterface,
  COMMISSION_REPOSITORY,
} from '../../domain/repositories/commission.repository.interface';
import { CreateCommissionCommand } from '../../domain/commands/create-commission.command';
import { CommissionCreatedEvent } from '../events/commission-created.event';

@CommandHandler(CreateCommissionCommand)
export class CreateCommissionHandler
  implements ICommandHandler<CreateCommissionCommand>
{
  private readonly logger = new Logger(CreateCommissionHandler.name);
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly repository: CommissionRepositoryInterface,
    @Inject('COMMISSIONS_RABBITMQ_CLIENT_ACCEPTED')
    private readonly rabbitmqClientAccepted: ClientProxy,
    @Inject('COMMISSIONS_RABBITMQ_CLIENT_DECLINED')
    private readonly rabbitmqClientDeclined: ClientProxy,
  ) {}

  async execute(command: CreateCommissionCommand): Promise<void> {
    const commission = new Commission(
      command.orderId,
      command.customerId,
      command.orderDescription,
      command.status,
    );

    await this.repository.save(commission);

    const event = new CommissionCreatedEvent(
      command.orderId,
      command.customerId,
      command.orderDescription,
      command.status,
    );

    if (command.status === 'accepted') {
      await firstValueFrom(
        this.rabbitmqClientAccepted.emit('order.accepted', event),
      );
      this.logger.log(
        `[CommissionService] Zamówienie zaakceptowane: ${JSON.stringify(event)}`,
      );
    } else {
      await firstValueFrom(
        this.rabbitmqClientDeclined.emit('order.declined', event),
      );
      this.logger.log(
        `[CommissionService] Zamówienie odrzucone: ${JSON.stringify(event)}`,
      );
    }
  }
}

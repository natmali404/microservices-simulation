import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  NotificationRepositoryInterface,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification.repository.interface';
import { DeleteNotificationCommand } from '../../domain/commands/delete-notification.command';
import { NotificationDeletedEvent } from '../events/notification-deleted.event';

@CommandHandler(DeleteNotificationCommand)
export class DeleteNotificationHandler
  implements ICommandHandler<DeleteNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteNotificationCommand): Promise<void> {
    const exists = await this.repository.findById(command.notificationId);
    if (!exists) throw new Error('Notification not found');

    await this.repository.delete(command.notificationId);
    this.eventBus.publish(new NotificationDeletedEvent(command.notificationId));
  }
}

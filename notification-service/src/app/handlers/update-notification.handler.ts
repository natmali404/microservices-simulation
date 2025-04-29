import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { Notification } from '../../domain/entities/notification.entity';
import { Inject } from '@nestjs/common';
import {
  NotificationRepositoryInterface,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification.repository.interface';
import { UpdateNotificationCommand } from '../../domain/commands/update-notification.command';
// import { NotificationUpdatedEvent } from '../events/notification-updated.event';

@CommandHandler(UpdateNotificationCommand)
export class UpdateNotificationHandler
  implements ICommandHandler<UpdateNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateNotificationCommand): Promise<void> {
    const notification = await this.repository.findById(command.notificationId);
    if (!notification) throw new Error('Notification not found');

    const updatedNotification = new Notification(
      notification.orderId,
      notification.customerId,
      notification.orderDescription,
      notification.status,
      command.newNotificationType,
      notification.amount,
      notification.paymentMethod,
    );

    await this.repository.save(updatedNotification);
  }
}

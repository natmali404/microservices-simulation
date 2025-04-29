import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  NotificationRepositoryInterface,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification.repository.interface';
import { GetNotificationQuery } from '../../domain/queries/get-notification.query';
import { NotificationResponseDto } from '../../web/dtos/notification-response.dto';

@QueryHandler(GetNotificationQuery)
export class GetNotificationHandler
  implements IQueryHandler<GetNotificationQuery>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryInterface,
  ) {}

  async execute(query: GetNotificationQuery): Promise<NotificationResponseDto> {
    const notification = await this.repository.findById(query.notificationId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    return {
      orderId: notification.orderId,
      customerId: notification.customerId,
      description: notification.orderDescription,
      status: notification.status,
      notificationType: notification.notificationType,
      amount: notification.amount,
      paymentMethod: notification.paymentMethod,
    };
  }
}

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  NotificationRepositoryInterface,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification.repository.interface';
import { GetAllNotificationsQuery } from '../../domain/queries/get-all-notifications.query';
import { NotificationResponseDto } from '../../web/dtos/notification-response.dto';

@QueryHandler(GetAllNotificationsQuery)
export class GetAllNotificationsHandler
  implements IQueryHandler<GetAllNotificationsQuery>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryInterface,
  ) {}

  async execute(
    query: GetAllNotificationsQuery,
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.repository.findAllPaginated(
      (query.page - 1) * query.limit,
      query.limit,
    );

    return notifications.map((notification) => ({
      orderId: notification.orderId,
      customerId: notification.customerId,
      description: notification.orderDescription,
      status: notification.status,
      notificationType: notification.notificationType,
      amount: notification.amount,
      paymentMethod: notification.paymentMethod,
    }));
  }
}

import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommissionCreatedEvent } from '../events/commission-created.event';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { Notification } from '../../domain/entities/notification.entity';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository.interface';
import { NotificationRepository } from '../../infrastructure/persistence/notification.repository';

@EventsHandler(CommissionCreatedEvent, PaymentCreatedEvent)
export class NotificationHandler
  implements IEventHandler<CommissionCreatedEvent | PaymentCreatedEvent>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}
  private readonly logger = new Logger(NotificationHandler.name);

  async handle(event: CommissionCreatedEvent | PaymentCreatedEvent) {
    let notification: Notification;

    //ifologia - jak rozwiazac?
    if (event instanceof CommissionCreatedEvent) {
      notification = new Notification(
        event.orderId,
        event.customerId,
        event.orderDescription,
        'declined',
        'email',
      );
    } else if (event instanceof PaymentCreatedEvent) {
      notification = new Notification(
        event.orderId,
        event.customerId,
        event.orderDescription,
        'accepted',
        'sms',
        event.amount,
        event.paymentMethod,
      );
    } else {
      throw new Error('Unhandled event type');
    }

    await this.notificationRepository.save(notification);

    this.logger.log(
      `[NotificationService] Wysłano powiadomienie metodą ${notification.notificationType} dla zamówienia ${notification.orderId}: ${JSON.stringify(notification)}`,
    );
  }
}

import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { RmqContext } from '@nestjs/microservices';
import { PaymentCreatedEvent } from 'src/app/events/payment-created.event';
import { CommissionCreatedEvent } from 'src/app/events/commission-created.event';
import { NotificationHandler } from 'src/app/handlers/notification.handler';

@Controller()
export class NotificationEventsListener {
  constructor(private readonly notificationHandler: NotificationHandler) {}
  private readonly logger = new Logger(NotificationEventsListener.name);

  @MessagePattern('order.paid')
  async handlePaymentCreated(
    @Payload() event: PaymentCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        '[NotificationService] Otrzymano event typu "order.paid"',
        event,
      );

      const passedEvent = new PaymentCreatedEvent(
        event.orderId,
        event.customerId,
        event.orderDescription,
        event.status,
        event.amount,
        event.paymentMethod,
      );
      await this.notificationHandler.handle(passedEvent);

      channel.ack(originalMsg);
      this.logger.log('[NotificationService] ACK');
    } catch (err) {
      this.logger.error(
        '[NotificationService] NotificationEventsListener Error:',
        err,
      );

      channel.nack(originalMsg, false, false);
      this.logger.error('[NotificationService] NACK');

      throw err;
    }
  }

  @MessagePattern('order.declined')
  async handleCommissionCreated(
    @Payload() event: CommissionCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        '[NotificationService] Otrzymano event typu "order.declined"',
        event,
      );

      const passedEvent = new CommissionCreatedEvent(
        event.orderId,
        event.customerId,
        event.orderDescription,
        event.status,
      );

      await this.notificationHandler.handle(passedEvent);

      channel.ack(originalMsg);
      this.logger.log('[NotificationService] ACK');
    } catch (err) {
      this.logger.error(
        '[NotificationService] NotificationEventsListener Error:',
        err,
      );

      channel.nack(originalMsg, false, false);
      this.logger.error('[NotificationService] NACK');

      throw err;
    }
  }
}

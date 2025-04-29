import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { RmqContext } from '@nestjs/microservices';
import { OrderCreatedEvent } from 'src/app/events/order-created.event';
import { OrderCreatedHandler } from 'src/app/handlers/order-created.handler';

@Controller()
export class CommissionEventsListener {
  constructor(private readonly orderCreatedHandler: OrderCreatedHandler) {}

  private readonly logger = new Logger(CommissionEventsListener.name);

  @MessagePattern('order.created')
  async handleOrderCreated(
    @Payload() event: OrderCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log('[CommissionService] Otrzymano event:', event);

      await this.orderCreatedHandler.handle(event);

      channel.ack(originalMsg);
      this.logger.log('[CommissionService] ACK');
    } catch (err) {
      this.logger.error('[CommissionService] Error:', err);

      channel.nack(originalMsg, false, false);
      this.logger.error('[CommissionService] NACK');
    }
  }
}

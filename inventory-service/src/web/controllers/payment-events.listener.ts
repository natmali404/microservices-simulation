import { Controller, Logger } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentCreatedEvent } from 'src/app/events/payment-created.event';
import { PaymentCreatedHandler } from 'src/app/handlers/payment-created.handler';

@Controller()
export class PaymentEventsListener {
  constructor(private readonly paymentCreatedHandler: PaymentCreatedHandler) {}

  private readonly logger = new Logger(PaymentEventsListener.name);

  @MessagePattern('order.paid')
  async handlePaymentCreated(
    @Payload() event: PaymentCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log('[InventoryService] Otrzymano event:', event);

      await this.paymentCreatedHandler.handle(event);

      channel.ack(originalMsg);
      this.logger.log('[InventoryService] ACK');
    } catch (err) {
      this.logger.error('[InventoryService] Error:', err);

      channel.nack(originalMsg, false, false);
      this.logger.error('[InventoryService] NACK');

      throw err;
    }
  }
}

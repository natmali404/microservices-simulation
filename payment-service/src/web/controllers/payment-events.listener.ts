import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { RmqContext } from '@nestjs/microservices';
import { CommissionCreatedEvent } from 'src/app/events/commission-created.event';
import { CommissionCreatedHandler } from 'src/app/handlers/commission-created.handler';

@Controller()
export class PaymentEventsListener {
  constructor(
    private readonly commissionCreatedHandler: CommissionCreatedHandler,
  ) {}
  private readonly logger = new Logger(PaymentEventsListener.name);

  @MessagePattern('order.accepted')
  async handleCommissionCreated(
    @Payload() event: CommissionCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log('[PaymentService] Otrzymano event:', event);

      await this.commissionCreatedHandler.handle(event);

      channel.ack(originalMsg);
      this.logger.log('[PaymentService] ACK');
    } catch (err) {
      this.logger.error('[PaymentService] Error:', err);

      channel.nack(originalMsg, false, false);
      this.logger.error('[PaymentService] NACK');

      throw err;
    }
  }
}

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import { GetPaymentQuery } from '../../domain/queries/get-payment.query';
import { PaymentResponseDto } from '../../web/dtos/payment-response.dto';

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repository: PaymentRepositoryInterface,
  ) {}

  async execute(query: GetPaymentQuery): Promise<PaymentResponseDto> {
    const payment = await this.repository.findById(query.paymentId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    return {
      orderId: payment.orderId,
      customerId: payment.customerId,
      description: payment.orderDescription,
      status: payment.status,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
    };
  }
}

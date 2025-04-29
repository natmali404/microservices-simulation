import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import { GetAllPaymentsQuery } from '../../domain/queries/get-all-payments.query';
import { PaymentResponseDto } from '../../web/dtos/payment-response.dto';

@QueryHandler(GetAllPaymentsQuery)
export class GetAllPaymentsHandler
  implements IQueryHandler<GetAllPaymentsQuery>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repository: PaymentRepositoryInterface,
  ) {}

  async execute(query: GetAllPaymentsQuery): Promise<PaymentResponseDto[]> {
    const payments = await this.repository.findAllPaginated(
      (query.page - 1) * query.limit,
      query.limit,
    );

    return payments.map((payment) => ({
      orderId: payment.orderId,
      customerId: payment.customerId,
      description: payment.orderDescription,
      status: payment.status,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
    }));
  }
}

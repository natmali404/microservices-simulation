import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  FinalOrderRepositoryInterface,
  FINAL_ORDER_REPOSITORY,
} from '../../domain/repositories/final-order.repository.interface';
import { GetAllFinalOrdersQuery } from '../../domain/queries/get-all-final-orders.query';
import { FinalOrderResponseDto } from '../../web/dtos/final-order-response.dto';

@QueryHandler(GetAllFinalOrdersQuery)
export class GetAllFinalOrdersHandler
  implements IQueryHandler<GetAllFinalOrdersQuery>
{
  constructor(
    @Inject(FINAL_ORDER_REPOSITORY)
    private readonly repository: FinalOrderRepositoryInterface,
  ) {}

  async execute(
    query: GetAllFinalOrdersQuery,
  ): Promise<FinalOrderResponseDto[]> {
    const finalOrders = await this.repository.findAllPaginated(
      (query.page - 1) * query.limit,
      query.limit,
    );

    return finalOrders.map((finalOrder) => ({
      orderId: finalOrder.orderId,
      customerId: finalOrder.customerId,
      description: finalOrder.orderDescription,
      status: finalOrder.status,
      amount: finalOrder.amount,
      paymentMethod: finalOrder.paymentMethod,
      isFinished: finalOrder.isFinished,
    }));
  }
}

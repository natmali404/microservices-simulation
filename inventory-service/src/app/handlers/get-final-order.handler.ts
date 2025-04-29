import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  FinalOrderRepositoryInterface,
  FINAL_ORDER_REPOSITORY,
} from '../../domain/repositories/final-order.repository.interface';
import { GetFinalOrderQuery } from '../../domain/queries/get-final-order.query';
import { FinalOrderResponseDto } from '../../web/dtos/final-order-response.dto';

@QueryHandler(GetFinalOrderQuery)
export class GetFinalOrderHandler implements IQueryHandler<GetFinalOrderQuery> {
  constructor(
    @Inject(FINAL_ORDER_REPOSITORY)
    private readonly repository: FinalOrderRepositoryInterface,
  ) {}

  async execute(query: GetFinalOrderQuery): Promise<FinalOrderResponseDto> {
    const finalOrder = await this.repository.findById(query.finalOrderId);

    if (!finalOrder) {
      throw new Error('FinalOrder not found');
    }

    return {
      orderId: finalOrder.orderId,
      customerId: finalOrder.customerId,
      description: finalOrder.orderDescription,
      status: finalOrder.status,
      amount: finalOrder.amount,
      paymentMethod: finalOrder.paymentMethod,
      isFinished: finalOrder.isFinished,
    };
  }
}

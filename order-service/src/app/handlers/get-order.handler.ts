// src/application/handlers/get-order.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  OrderRepositoryInterface,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { GetOrderQuery } from '../../domain/queries/get-order.query';
import { OrderResponseDto } from '../../web/dtos/order-response.dto';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryInterface,
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderResponseDto> {
    const order = await this.repository.findById(query.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    return {
      id: order.orderId,
      customerId: order.customerId,
      description: order.orderDescription,
    };
  }
}

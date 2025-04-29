// src/app/handlers/get-all-orders.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  OrderRepositoryInterface,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { GetAllOrdersQuery } from '../../domain/queries/get-all-orders.query';
import { OrderResponseDto } from '../../web/dtos/order-response.dto';

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryInterface,
  ) {}

  async execute(query: GetAllOrdersQuery): Promise<OrderResponseDto[]> {
    const orders = await this.repository.findAllPaginated(
      (query.page - 1) * query.limit,
      query.limit,
    );

    return orders.map((order) => ({
      id: order.orderId,
      customerId: order.customerId,
      description: order.orderDescription,
    }));
  }
}

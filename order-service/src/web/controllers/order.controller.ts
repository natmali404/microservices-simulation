// src/web/controllers/order.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { DeleteOrderCommand } from '../../domain/commands/delete-order.command';
import { GetAllOrdersQuery } from '../../domain/queries/get-all-orders.query';
import { UpdateOrderCommand } from '../../domain/commands/update-order.command';
import { CreateOrderCommand } from '../../domain/commands/create-order.command';
import { GetOrderQuery } from '../../domain/queries/get-order.query';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    const orderId = uuidv4();
    await this.commandBus.execute(
      new CreateOrderCommand(orderId, dto.customerId, dto.orderDescription),
    );
    return {
      status: 'Order created',
      orderId,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.queryBus.execute(new GetOrderQuery(id));
  }

  // Aktualizacja zamówienia
  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    await this.commandBus.execute(
      new UpdateOrderCommand(id, dto.newDescription),
    );
    return { status: 'Order updated' };
  }

  // Usuwanie zamówienia
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteOrderCommand(id));
    return { status: 'Order deleted' };
  }

  // Lista zamówień (z paginacją)
  @Get()
  async getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<OrderResponseDto[]> {
    return this.queryBus.execute(new GetAllOrdersQuery(page, limit));
  }
}

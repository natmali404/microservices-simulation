// src/web/controllers/finalOrder.controller.ts
import {
  Body,
  Controller,
  //Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
//import { CreateFinalOrderDto } from '../dtos/create-finalOrder.dto';
import { UpdateFinalOrderDto } from '../dtos/update-final-order.dto';
import { DeleteFinalOrderCommand } from '../../domain/commands/delete-final-order.command';
import { GetAllFinalOrdersQuery } from '../../domain/queries/get-all-final-orders.query';
import { UpdateFinalOrderCommand } from '../../domain/commands/update-final-order.command';
//import { CreateFinalOrderCommand } from '../../domain/commands/create-finalOrder.command';
import { GetFinalOrderQuery } from '../../domain/queries/get-final-order.query';
import { FinalOrderResponseDto } from '../dtos/final-order-response.dto';
//import { v4 as uuidv4 } from 'uuid';

@Controller('finalOrders')
export class FinalOrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  //ten mikroserwis nie powinien miec posta bo otwrzymuje zamowienia z innego mikroserwisu

  // @Post()
  // async createFinalOrder(@Body() dto: CreateFinalOrderDto) {
  //   const finalOrderId = uuidv4();
  //   await this.commandBus.execute(
  //     new CreateFinalOrderCommand(finalOrderId, dto.customerId, dto.finalOrderDescription),
  //   );
  //   return {
  //     status: 'FinalOrder created',
  //     finalOrderId,
  //     timestamp: new Date().toISOString(),
  //   };
  // }

  @Get(':id')
  async getFinalOrder(@Param('id') id: string): Promise<FinalOrderResponseDto> {
    return this.queryBus.execute(new GetFinalOrderQuery(id));
  }

  @Patch(':id')
  async updateFinalOrder(
    @Param('id') id: string,
    @Body() dto: UpdateFinalOrderDto,
  ) {
    await this.commandBus.execute(
      new UpdateFinalOrderCommand(id, dto.newIsFinished),
    );
    return { status: 'FinalOrder updated' };
  }

  @Delete(':id')
  async deleteFinalOrder(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteFinalOrderCommand(id));
    return { status: 'FinalOrder deleted' };
  }

  @Get()
  async getAllFinalOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<FinalOrderResponseDto[]> {
    return this.queryBus.execute(new GetAllFinalOrdersQuery(page, limit));
  }
}

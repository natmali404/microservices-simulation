// src/web/controllers/payment.controller.ts
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
//import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';
import { DeletePaymentCommand } from '../../domain/commands/delete-payment.command';
import { GetAllPaymentsQuery } from '../../domain/queries/get-all-payments.query';
import { UpdatePaymentCommand } from '../../domain/commands/update-payment.command';
//import { CreatePaymentCommand } from '../../domain/commands/create-payment.command';
import { GetPaymentQuery } from '../../domain/queries/get-payment.query';
import { PaymentResponseDto } from '../dtos/payment-response.dto';
//import { v4 as uuidv4 } from 'uuid';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  //ten mikroserwis nie powinien miec posta bo otwrzymuje zamowienia z innego mikroserwisu

  // @Post()
  // async createPayment(@Body() dto: CreatePaymentDto) {
  //   const paymentId = uuidv4();
  //   await this.commandBus.execute(
  //     new CreatePaymentCommand(paymentId, dto.customerId, dto.paymentDescription),
  //   );
  //   return {
  //     status: 'Payment created',
  //     paymentId,
  //     timestamp: new Date().toISOString(),
  //   };
  // }

  @Get(':id')
  async getPayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.queryBus.execute(new GetPaymentQuery(id));
  }

  @Patch(':id')
  async updatePayment(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    await this.commandBus.execute(
      new UpdatePaymentCommand(id, dto.newAmount, dto.newPaymentMethod),
    );
    return { status: 'Payment updated' };
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    await this.commandBus.execute(new DeletePaymentCommand(id));
    return { status: 'Payment deleted' };
  }

  @Get()
  async getAllPayments(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaymentResponseDto[]> {
    return this.queryBus.execute(new GetAllPaymentsQuery(page, limit));
  }
}

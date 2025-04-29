// src/web/controllers/commission.controller.ts
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
//import { CreateCommissionDto } from '../dtos/create-commission.dto';
import { UpdateCommissionDto } from '../dtos/update-commission.dto';
import { DeleteCommissionCommand } from '../../domain/commands/delete-commission.command';
import { GetAllCommissionsQuery } from '../../domain/queries/get-all-commissions.query';
import { UpdateCommissionCommand } from '../../domain/commands/update-commission.command';
//import { CreateCommissionCommand } from '../../domain/commands/create-commission.command';
import { GetCommissionQuery } from '../../domain/queries/get-commission.query';
import { CommissionResponseDto } from '../dtos/commission-response.dto';
//import { v4 as uuidv4 } from 'uuid';

@Controller('commissions')
export class CommissionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  //ten mikroserwis nie powinien miec posta bo otwrzymuje zamowienia z innego mikroserwisu

  // @Post()
  // async createCommission(@Body() dto: CreateCommissionDto) {
  //   const commissionId = uuidv4();
  //   await this.commandBus.execute(
  //     new CreateCommissionCommand(commissionId, dto.customerId, dto.commissionDescription),
  //   );
  //   return {
  //     status: 'Commission created',
  //     commissionId,
  //     timestamp: new Date().toISOString(),
  //   };
  // }

  @Get(':id')
  async getCommission(@Param('id') id: string): Promise<CommissionResponseDto> {
    return this.queryBus.execute(new GetCommissionQuery(id));
  }

  @Patch(':id')
  async updateCommission(
    @Param('id') id: string,
    @Body() dto: UpdateCommissionDto,
  ) {
    await this.commandBus.execute(
      new UpdateCommissionCommand(id, dto.newStatus),
    );
    return { status: 'Commission updated' };
  }

  @Delete(':id')
  async deleteCommission(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteCommissionCommand(id));
    return { status: 'Commission deleted' };
  }

  @Get()
  async getAllCommissions(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<CommissionResponseDto[]> {
    return this.queryBus.execute(new GetAllCommissionsQuery(page, limit));
  }
}

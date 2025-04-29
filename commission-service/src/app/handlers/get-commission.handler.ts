import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  CommissionRepositoryInterface,
  COMMISSION_REPOSITORY,
} from '../../domain/repositories/commission.repository.interface';
import { GetCommissionQuery } from '../../domain/queries/get-commission.query';
import { CommissionResponseDto } from '../../web/dtos/commission-response.dto';

@QueryHandler(GetCommissionQuery)
export class GetCommissionHandler implements IQueryHandler<GetCommissionQuery> {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly repository: CommissionRepositoryInterface,
  ) {}

  async execute(query: GetCommissionQuery): Promise<CommissionResponseDto> {
    const commission = await this.repository.findById(query.commissionId);

    if (!commission) {
      throw new Error('Commission not found');
    }

    return {
      orderId: commission.orderId,
      customerId: commission.customerId,
      description: commission.orderDescription,
      status: commission.status,
    };
  }
}

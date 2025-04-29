import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  CommissionRepositoryInterface,
  COMMISSION_REPOSITORY,
} from '../../domain/repositories/commission.repository.interface';
import { GetAllCommissionsQuery } from '../../domain/queries/get-all-commissions.query';
import { CommissionResponseDto } from '../../web/dtos/commission-response.dto';

@QueryHandler(GetAllCommissionsQuery)
export class GetAllCommissionsHandler
  implements IQueryHandler<GetAllCommissionsQuery>
{
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly repository: CommissionRepositoryInterface,
  ) {}

  async execute(
    query: GetAllCommissionsQuery,
  ): Promise<CommissionResponseDto[]> {
    const commissions = await this.repository.findAllPaginated(
      (query.page - 1) * query.limit,
      query.limit,
    );

    return commissions.map((commission) => ({
      orderId: commission.orderId,
      customerId: commission.customerId,
      description: commission.orderDescription,
      status: commission.status,
    }));
  }
}

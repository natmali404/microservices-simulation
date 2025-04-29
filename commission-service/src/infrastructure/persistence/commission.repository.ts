import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionRepositoryInterface } from '../../domain/repositories/commission.repository.interface';
import { Commission } from '../../domain/entities/commission.entity';
import { CommissionEntity } from './commission.entity.schema';

@Injectable()
export class CommissionRepository implements CommissionRepositoryInterface {
  constructor(
    @InjectRepository(CommissionEntity)
    private readonly commissionRepository: Repository<CommissionEntity>,
  ) {}

  async save(commission: Commission): Promise<CommissionEntity> {
    const commissionEntity = new CommissionEntity();
    commissionEntity.orderId = commission.orderId;
    commissionEntity.customerId = commission.customerId;
    commissionEntity.orderDescription = commission.orderDescription;
    commissionEntity.status = commission.status;

    await this.commissionRepository.save(commissionEntity);
    return commissionEntity;
  }

  async findById(commissionId: string): Promise<Commission | null> {
    const commission = await this.commissionRepository.findOne({
      where: { commissionId },
    });
    return commission
      ? new Commission(
          commission.orderId,
          commission.customerId,
          commission.orderDescription,
          commission.status,
        )
      : null;
  }

  async findAll(): Promise<Commission[]> {
    const commissions = await this.commissionRepository.find();
    return commissions.map(
      (commission) =>
        new Commission(
          commission.orderId,
          commission.customerId,
          commission.orderDescription,
          commission.status,
        ),
    );
  }

  async delete(commissionId: string): Promise<void> {
    await this.commissionRepository.delete({ commissionId });
  }

  async findAllPaginated(skip: number, take: number): Promise<Commission[]> {
    const commissions = await this.commissionRepository.find({
      skip,
      take,
    });
    return commissions.map(
      (commission) =>
        new Commission(
          commission.orderId,
          commission.customerId,
          commission.orderDescription,
          commission.status,
        ),
    );
  }
}

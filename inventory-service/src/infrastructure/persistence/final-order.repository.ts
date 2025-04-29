import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinalOrderRepositoryInterface } from '../../domain/repositories/final-order.repository.interface';
import { FinalOrder } from '../../domain/entities/final-order.entity';
import { FinalOrderEntity } from './final-order.entity.schema';

@Injectable()
export class FinalOrderRepository implements FinalOrderRepositoryInterface {
  constructor(
    @InjectRepository(FinalOrderEntity)
    private readonly finalOrderRepository: Repository<FinalOrderEntity>,
  ) {}

  async save(finalOrder: FinalOrder): Promise<FinalOrderEntity> {
    const finalOrderEntity = new FinalOrderEntity();
    finalOrderEntity.orderId = finalOrder.orderId;
    finalOrderEntity.customerId = finalOrder.customerId;
    finalOrderEntity.orderDescription = finalOrder.orderDescription;
    finalOrderEntity.status = finalOrder.status;
    finalOrderEntity.amount = finalOrder.amount;
    finalOrderEntity.paymentMethod = finalOrder.paymentMethod;

    await this.finalOrderRepository.save(finalOrderEntity);
    return finalOrderEntity;
  }

  async findById(finalOrderId: string): Promise<FinalOrder | null> {
    const finalOrder = await this.finalOrderRepository.findOne({
      where: { finalOrderId },
    });
    return finalOrder
      ? new FinalOrder(
          finalOrder.orderId,
          finalOrder.customerId,
          finalOrder.orderDescription,
          finalOrder.status,
          finalOrder.amount,
          finalOrder.paymentMethod,
          finalOrder.isFinished,
        )
      : null;
  }

  async findAll(): Promise<FinalOrder[]> {
    const finalOrders = await this.finalOrderRepository.find();
    return finalOrders.map(
      (finalOrder) =>
        new FinalOrder(
          finalOrder.orderId,
          finalOrder.customerId,
          finalOrder.orderDescription,
          finalOrder.status,
          finalOrder.amount,
          finalOrder.paymentMethod,
          finalOrder.isFinished,
        ),
    );
  }

  async delete(finalOrderId: string): Promise<void> {
    await this.finalOrderRepository.delete({ finalOrderId });
  }

  async findAllPaginated(skip: number, take: number): Promise<FinalOrder[]> {
    const finalOrders = await this.finalOrderRepository.find({
      skip,
      take,
    });
    return finalOrders.map(
      (finalOrder) =>
        new FinalOrder(
          finalOrder.orderId,
          finalOrder.customerId,
          finalOrder.orderDescription,
          finalOrder.status,
          finalOrder.amount,
          finalOrder.paymentMethod,
          finalOrder.isFinished,
        ),
    );
  }

  async countBy(criteria: Partial<FinalOrderEntity>): Promise<number> {
    return this.finalOrderRepository.countBy(criteria);
  }
}

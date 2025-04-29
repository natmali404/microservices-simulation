import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRepositoryInterface } from '../../domain/repositories/payment.repository.interface';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentEntity } from './payment.entity.schema';

@Injectable()
export class PaymentRepository implements PaymentRepositoryInterface {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async save(payment: Payment): Promise<PaymentEntity> {
    const paymentEntity = new PaymentEntity();
    paymentEntity.orderId = payment.orderId;
    paymentEntity.customerId = payment.customerId;
    paymentEntity.orderDescription = payment.orderDescription;
    paymentEntity.status = payment.status;
    paymentEntity.amount = payment.amount;
    paymentEntity.paymentMethod = payment.paymentMethod;

    await this.paymentRepository.save(paymentEntity);
    return paymentEntity;
  }

  async findById(paymentId: string): Promise<Payment | null> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId },
    });
    return payment
      ? new Payment(
          payment.orderId,
          payment.customerId,
          payment.orderDescription,
          payment.status,
          payment.amount,
          payment.paymentMethod,
        )
      : null;
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.paymentRepository.find();
    return payments.map(
      (payment) =>
        new Payment(
          payment.orderId,
          payment.customerId,
          payment.orderDescription,
          payment.status,
          payment.amount,
          payment.paymentMethod,
        ),
    );
  }

  async delete(paymentId: string): Promise<void> {
    await this.paymentRepository.delete({ paymentId });
  }

  async findAllPaginated(skip: number, take: number): Promise<Payment[]> {
    const payments = await this.paymentRepository.find({
      skip,
      take,
    });
    return payments.map(
      (payment) =>
        new Payment(
          payment.orderId,
          payment.customerId,
          payment.orderDescription,
          payment.status,
          payment.amount,
          payment.paymentMethod,
        ),
    );
  }
}

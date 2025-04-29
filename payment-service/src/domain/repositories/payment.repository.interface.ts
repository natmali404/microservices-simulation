import { Payment } from '../entities/payment.entity';
import { PaymentEntity } from '../../infrastructure/persistence/payment.entity.schema';

//ts nie może użyć interfejsu jako wartości w kontekście DI, uzywam tokenu
export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

export interface PaymentRepositoryInterface {
  save(payment: Payment): Promise<PaymentEntity>;
  findById(paymentId: string): Promise<Payment | null>;
  findAll(): Promise<Payment[]>;
  delete(paymentId: string): Promise<void>;
  findAllPaginated(skip: number, take: number): Promise<Payment[]>;
}

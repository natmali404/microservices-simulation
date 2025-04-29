import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  paymentId: string;

  @Column()
  orderId: string;

  @Column()
  customerId: string;

  @Column()
  orderDescription: string;

  @Column()
  status: string;

  @Column()
  amount: number;

  @Column()
  paymentMethod: string;
}

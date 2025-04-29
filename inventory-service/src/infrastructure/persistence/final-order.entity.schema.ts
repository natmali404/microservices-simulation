import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('final_orders')
export class FinalOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  finalOrderId: string;

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

  @Column({ default: false })
  isFinished: boolean;
}

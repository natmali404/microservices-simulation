import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn()
  orderId: string;

  @Column()
  customerId: string;

  @Column()
  orderDescription: string;
}

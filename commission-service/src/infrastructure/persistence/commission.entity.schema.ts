import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('commissions')
export class CommissionEntity {
  @PrimaryGeneratedColumn('uuid')
  commissionId: string;

  @Column()
  orderId: string;

  @Column()
  customerId: string;

  @Column()
  orderDescription: string;

  @Column()
  status: string;
}

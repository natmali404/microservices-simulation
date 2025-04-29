import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  notificationId: string;

  @Column()
  orderId: string;

  @Column()
  customerId: string;

  @Column()
  orderDescription: string;

  @Column()
  status: 'accepted' | 'declined';

  @Column({ nullable: true })
  amount?: number;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column()
  notificationType: 'email' | 'sms' | 'push';
}

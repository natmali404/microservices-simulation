import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationRepositoryInterface } from '../../domain/repositories/notification.repository.interface';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationEntity } from './notification.entity.schema';

@Injectable()
export class NotificationRepository implements NotificationRepositoryInterface {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async save(notification: Notification): Promise<NotificationEntity> {
    const notificationEntity = new NotificationEntity();
    notificationEntity.orderId = notification.orderId;
    notificationEntity.customerId = notification.customerId;
    notificationEntity.orderDescription = notification.orderDescription;
    notificationEntity.status = notification.status;
    notificationEntity.amount = notification.amount;
    notificationEntity.paymentMethod = notification.paymentMethod;
    notificationEntity.notificationType = notification.notificationType;

    await this.notificationRepository.save(notificationEntity);
    return notificationEntity;
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({
      where: { notificationId },
    });
    return notification
      ? new Notification(
          notification.orderId,
          notification.customerId,
          notification.orderDescription,
          notification.status,
          notification.notificationType,
          notification.amount,
          notification.paymentMethod,
        )
      : null;
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find();
    return notifications.map(
      (notification) =>
        new Notification(
          notification.orderId,
          notification.customerId,
          notification.orderDescription,
          notification.status,
          notification.notificationType,
          notification.amount,
          notification.paymentMethod,
        ),
    );
  }

  async delete(notificationId: string): Promise<void> {
    await this.notificationRepository.delete({ notificationId });
  }

  async findAllPaginated(skip: number, take: number): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      skip,
      take,
    });
    return notifications.map(
      (notification) =>
        new Notification(
          notification.orderId,
          notification.customerId,
          notification.orderDescription,
          notification.status,
          notification.notificationType,
          notification.amount,
          notification.paymentMethod,
        ),
    );
  }
}

import { Notification } from '../entities/notification.entity';
import { NotificationEntity } from '../../infrastructure/persistence/notification.entity.schema';

//ts nie może użyć interfejsu jako wartości w kontekście DI, uzywam tokenu
export const NOTIFICATION_REPOSITORY = 'NOTIFICATION_REPOSITORY';

export interface NotificationRepositoryInterface {
  save(notification: Notification): Promise<NotificationEntity>;
  findById(notificationId: string): Promise<Notification | null>;
  findAll(): Promise<Notification[]>;
  delete(notificationId: string): Promise<void>;
  findAllPaginated(skip: number, take: number): Promise<Notification[]>;
}

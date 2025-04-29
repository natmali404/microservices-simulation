// src/domain/repositories/order.repository.interface.ts
import { Order } from '../entities/order.entity';

//TypeScript nie może użyć interfejsu jako wartości w kontekście DI, uzywam tokenu
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepositoryInterface {
  save(order: Order): Promise<void>;
  findById(orderId: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  delete(orderId: string): Promise<void>;
  findAllPaginated(skip: number, take: number): Promise<Order[]>;
}

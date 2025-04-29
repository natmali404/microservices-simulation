import { FinalOrder } from '../entities/final-order.entity';
import { FinalOrderEntity } from '../../infrastructure/persistence/final-order.entity.schema';

//ts nie może użyć interfejsu jako wartości w kontekście DI, uzywam tokenu
export const FINAL_ORDER_REPOSITORY = 'FINAL_ORDER_REPOSITORY';

export interface FinalOrderRepositoryInterface {
  save(finalOrder: FinalOrder): Promise<FinalOrderEntity>;
  findById(finalOrderId: string): Promise<FinalOrder | null>;
  findAll(): Promise<FinalOrder[]>;
  delete(finalOrderId: string): Promise<void>;
  findAllPaginated(skip: number, take: number): Promise<FinalOrder[]>;
  countBy(criteria: Partial<FinalOrderEntity>): Promise<number>;
}

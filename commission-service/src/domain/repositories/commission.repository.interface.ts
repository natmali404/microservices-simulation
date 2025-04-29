import { Commission } from '../entities/commission.entity';
import { CommissionEntity } from '../../infrastructure/persistence/commission.entity.schema';

//ts nie może użyć interfejsu jako wartości w kontekście DI, uzywam tokenu
export const COMMISSION_REPOSITORY = 'COMMISSION_REPOSITORY';

export interface CommissionRepositoryInterface {
  save(commission: Commission): Promise<CommissionEntity>;
  findById(commissionId: string): Promise<Commission | null>;
  findAll(): Promise<Commission[]>;
  delete(commissionId: string): Promise<void>;
  findAllPaginated(skip: number, take: number): Promise<Commission[]>;
}

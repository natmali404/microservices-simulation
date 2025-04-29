import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import {
  FinalOrderRepositoryInterface,
  FINAL_ORDER_REPOSITORY,
} from '../../domain/repositories/final-order.repository.interface';

@Injectable()
export class InventoryTrackerService implements OnModuleInit {
  private count: number = 0;
  private readonly logger = new Logger(InventoryTrackerService.name);

  constructor(
    @Inject(FINAL_ORDER_REPOSITORY)
    private readonly repository: FinalOrderRepositoryInterface,
  ) {}

  async onModuleInit() {
    await this.reconstructCount();
    this.logCount();
  }

  private async reconstructCount() {
    this.count = await this.repository.countBy({ isFinished: false });
  }

  public increment() {
    this.count++;
    this.logCount();
  }

  public decrement() {
    if (this.count > 0) this.count--;
    this.logCount();
  }

  public getCount(): number {
    return this.count;
  }

  private logCount() {
    this.logger.log(
      `[InventoryTracker] Aktualna liczba zamówień w toku: ${this.count}`,
    );
  }
}

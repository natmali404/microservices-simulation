export class CommissionUpdatedEvent {
  constructor(
    public readonly commissionId: string,
    public readonly newStatus: string,
  ) {}
}

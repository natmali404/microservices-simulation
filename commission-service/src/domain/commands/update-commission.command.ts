export class UpdateCommissionCommand {
  constructor(
    public readonly commissionId: string,
    public readonly newStatus: string,
  ) {}
}

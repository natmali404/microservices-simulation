export class UpdateFinalOrderCommand {
  constructor(
    public readonly finalOrderId: string,
    public readonly newIsFinished: boolean,
  ) {}
}

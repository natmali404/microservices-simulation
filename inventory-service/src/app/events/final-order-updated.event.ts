export class FinalOrderUpdatedEvent {
  constructor(
    public readonly finalOrderId: string,
    public readonly newIsFinished: boolean,
  ) {}
}

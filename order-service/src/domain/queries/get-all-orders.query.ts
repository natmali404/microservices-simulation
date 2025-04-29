// src/app/queries/get-all-orders.query.ts
export class GetAllOrdersQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}

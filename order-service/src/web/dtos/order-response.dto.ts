// src/web/dtos/order-response.dto.ts
export class OrderResponseDto {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly description: string,
  ) {}
}

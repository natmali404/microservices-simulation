export class CreateFinalOrderDto {
  orderId: string;
  customerId: string;
  orderDescription: string;
  status: string;
  //new fields
  amount: number;
  paymentMethod: string;
  isFinished: boolean;
}

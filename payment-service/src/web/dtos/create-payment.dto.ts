export class CreatePaymentDto {
  orderId: string;
  customerId: string;
  orderDescription: string;
  status: string;
  //new fields
  amount: number;
  paymentMethod: string;
}

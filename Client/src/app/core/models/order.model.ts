export interface Order {
  _id: string;
  orderNumber?: string;
  dealId?: any;
  buyer: any;
  supplier: any;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

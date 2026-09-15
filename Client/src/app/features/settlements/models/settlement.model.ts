export interface Settlement {
  _id: string;
  order: any;
  payment: any;
  supplier: any;
  productAmount: number;
  commissionAmount: number;
  supplierAmount: number;
  status: 'PENDING' | 'HELD' | 'RELEASED' | 'CANCELLED';
  heldUntil?: string;
  releasedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

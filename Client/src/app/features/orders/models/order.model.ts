export interface Order {
  _id: string;
  deal: string;
  buyer: {
    _id: string;
    name: string;
    phone: string;
  };
  supplier: {
    _id: string;
    name: string;
  };
  poolMember?: string;
  buyingRequest?: string;
  quantity: number;
  unitPrice: number;
  deliveryFee: number;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
  };
  phone: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'READY_FOR_PICKUP'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'RETURNED'
    | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

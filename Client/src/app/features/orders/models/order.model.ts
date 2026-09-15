export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  rating?: number;
}

export interface OrderDeal {
  _id: string;
  pool?: string;
  selectedOffer?: string;
  supplier?: string;
  finalQuantity?: number;
  effectiveUnitPrice?: number;
  deliveryDays?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
}

export interface Order {
  _id: string;

  deal: OrderDeal;

  buyer: OrderUser;

  poolMember?: string;

  buyingRequest?: string;

  supplier: OrderUser;

  quantity: number;

  unitPrice: number;

  deliveryFee: number;

  totalAmount: number;

  shippingAddress: ShippingAddress;

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

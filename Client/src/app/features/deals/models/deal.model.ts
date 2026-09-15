export interface Deal {
  _id: string;
  pool?: string;
  selectedOffer: string;
  supplier: {
    _id: string;
    name: string;
    rating: number;
  };
  finalQuantity: number;
  effectiveUnitPrice: number;
  deliveryDays: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

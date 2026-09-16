export interface PricingTier {
  minQty: number;
  unitPrice: number;
}

export interface SelectedOffer {
  _id: string;
  pool: string;
  supplier: string;
  moq: number;
  pricingTiers: PricingTier[];
  deliveryDays: number;
  warranty: string;
  terms: string;
  status: string;
}

export interface Deal {
  _id: string;

  pool?: string;

  buyingRequest?: string;

  selectedOffer: SelectedOffer;

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

  totalOrdersCount?: number;
  confirmedOrdersCount?: number;
}

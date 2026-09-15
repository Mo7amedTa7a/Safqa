export interface Shipment {
  _id: string;
  order: any; // Can be typed later to Order if needed
  shippingPartner: any; // User object
  shipmentType: 'OUTBOUND' | 'RETURN';
  trackingNumber: string;
  pickupAddress: {
    street: string;
    city: string;
    country: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    country: string;
  };
  codAmount: number;
  status: 'PENDING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'DELIVERY_FAILED' | 'RETURN_TO_SUPPLIER' | 'RETURNED';
  pickupProof?: {
    type: string;
    value: string;
    time: Date;
  };
  createdAt?: string;
  updatedAt?: string;
}

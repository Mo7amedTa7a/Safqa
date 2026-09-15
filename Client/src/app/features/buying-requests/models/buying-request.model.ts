import { Product } from '../../products/models/product.model';

export type PurchaseType = 'DIRECT' | 'GROUP';

export type BuyingRequestStatus =
  | 'OPEN'
  | 'PENDING'
  | 'POOLED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'FULFILLED'
  | 'COMPLETED';

export interface BuyingRequest {
  _id: string;
  buyer: string | {
    _id?: string;
    name?: string;
    email?: string;
  };
  product: Product | string;
  variant: string;
  quantity: number;
  location: string;
  purchaseType: PurchaseType;
  status: BuyingRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuyingRequestDto {
  product: string;
  variant: string;
  quantity: number;
  location: string;
  purchaseType: PurchaseType;
}

export interface UpdateBuyingRequestDto {
  quantity: number;
  location: string;
}

export interface BuyingRequestListResponse {
  status: string;
  message: string;
  data: BuyingRequest[];
}

export interface BuyingRequestResponse {
  status: string;
  message: string;
  data: BuyingRequest;
}

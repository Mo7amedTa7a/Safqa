export interface Dispute {
  _id: string;
  order: any;
  buyer: any;
  reason: 'DAMAGED' | 'WRONG_PRODUCT' | 'MISSING_ITEM' | 'NOT_AS_DESCRIBED' | 'OTHER';
  description: string;
  evidence: string[];
  status: 'OPEN' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

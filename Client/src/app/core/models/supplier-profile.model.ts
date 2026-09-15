import { User } from './user.model';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type SupplierStatus = 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';

export interface SupplierProfile {
  _id?: string;
  user?: string | User;
  companyName: string;
  companyDescription: string;
  commercialRegistrationNumber: string;
  taxIdentificationNumber: string;
  businessAddress: string;
  businessPhone: string;
  website?: string;
  yearsInBusiness?: number;
  verificationStatus?: VerificationStatus;
  supplierStatus?: SupplierStatus | null;
  rejectionReason?: string;
  reviewedBy?: string | User;
  reviewedAt?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

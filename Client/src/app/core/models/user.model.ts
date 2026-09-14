export enum UserRole {
  BUYER = 'BUYER',
  SUPPLIER = 'SUPPLIER',
  SHIPPING_PARTNER = 'SHIPPING_PARTNER',
  ADMIN = 'ADMIN'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  rating?: number;
  isActive?: boolean;
}

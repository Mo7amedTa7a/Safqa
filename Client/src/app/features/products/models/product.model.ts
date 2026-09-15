export interface ProductVariant {
  _id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
}

export interface Supplier {
  _id?: string;
  name?: string;
  email?: string;
  rating?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  supplier?: Supplier | string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  status: string;
  message: string;
  data: Product[];
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface CategoryListResponse {
  status: string;
  results?: number;
  data: {
    categories: Category[];
  };
}

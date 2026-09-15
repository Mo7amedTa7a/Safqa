export interface Review {
  _id: string;
  order: any;
  reviewer: any;
  reviewedUser: any;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

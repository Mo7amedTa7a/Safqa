export interface AppNotification {
  _id: string;
  recipient: any;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntity?: {
    entityModel: string;
    entityId: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

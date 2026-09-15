import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order, ShippingAddress } from '../models/order.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(
      this.baseUrl
    );
  }

  getOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(
      `${this.baseUrl}/${id}`
    );
  }

  createOrder(
    dealId: string,
    shippingAddress: ShippingAddress,
    phone: string
  ): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(
      `${this.baseUrl}/${dealId}/create`,
      {
        shippingAddress,
        phone
      }
    );
  }

  updateOrderStatus(
    id: string,
    status: string
  ): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      `${this.baseUrl}/${id}/status`,
      {
        status
      }
    );
  }

  markReadyForPickup(
    id: string
  ): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      `${this.baseUrl}/${id}/ready-for-pickup`,
      {}
    );
  }

  cancelOrder(
    id: string
  ): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      `${this.baseUrl}/${id}/cancel`,
      {}
    );
  }
}

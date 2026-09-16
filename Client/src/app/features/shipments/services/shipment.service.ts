import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Shipment } from '../models/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private apiUrl = `${environment.apiUrl}/shipments`;

  constructor(private http: HttpClient) {}

  getShipments(filters?: any): Observable<{ message: string, data: Shipment[] }> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<{ message: string, data: Shipment[] }>(this.apiUrl, { params });
  }

  getShipmentById(id: string): Observable<{ message: string, data: Shipment }> {
    return this.http.get<{ message: string, data: Shipment }>(`${this.apiUrl}/${id}`);
  }

  updateShipmentStatus(id: string, status: string): Observable<{ message: string, data: Shipment }> {
    return this.http.patch<{ message: string, data: Shipment }>(`${this.apiUrl}/${id}/status`, { status });
  }

  assignShippingPartner(id: string, shippingPartnerId: string): Observable<{ message: string, data: Shipment }> {
    return this.http.patch<{ message: string, data: Shipment }>(`${this.apiUrl}/${id}/assign`, { shippingPartnerId });
  }

  addPickupProof(id: string, proof: FormData): Observable<{ message: string, data: Shipment }> {
    return this.http.post<{ message: string, data: Shipment }>(`${this.apiUrl}/${id}/pickup-proof`, proof);
  }

  createShipmentForOrder(orderId: string, data: any = {}): Observable<{ success: boolean, data: Shipment }> {
    return this.http.post<{ success: boolean, data: Shipment }>(`${this.apiUrl}/orders/${orderId}`, data);
  }

  getShipmentByOrderId(orderId: string): Observable<{ success: boolean, data: Shipment }> {
    return this.http.get<{ success: boolean, data: Shipment }>(`${this.apiUrl}/order/${orderId}`);
  }
}

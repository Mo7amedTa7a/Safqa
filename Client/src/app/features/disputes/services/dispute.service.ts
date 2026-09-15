import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Dispute } from '../models/dispute.model';

@Injectable({
  providedIn: 'root'
})
export class DisputeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createDispute(orderId: string, data: { reason: string; description: string; evidence?: string[] }): Observable<{ message: string, data: Dispute }> {
    return this.http.post<{ message: string, data: Dispute }>(`${this.apiUrl}/disputes/orders/${orderId}`, data);
  }

  getDisputes(filters?: any): Observable<{ message: string, data: Dispute[] }> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<{ message: string, data: Dispute[] }>(`${this.apiUrl}/disputes`, { params });
  }

  getDisputeById(id: string): Observable<{ message: string, data: Dispute }> {
    return this.http.get<{ message: string, data: Dispute }>(`${this.apiUrl}/disputes/${id}`);
  }

  reviewDispute(id: string, data: { status: string; adminNote?: string }): Observable<{ message: string, data: Dispute }> {
    return this.http.patch<{ message: string, data: Dispute }>(`${this.apiUrl}/disputes/${id}/review`, data);
  }

  resolveDispute(id: string, data: { status: string; adminNote?: string }): Observable<{ message: string, data: Dispute }> {
    return this.http.patch<{ message: string, data: Dispute }>(`${this.apiUrl}/disputes/${id}/resolve`, data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminDashboardStats {
  totalUsers: number;
  totalSuppliers: number;
  totalBuyingPools: number;
  totalBuyingRequests: number;
  totalDeals: number;
  totalOrders: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  private settlementsUrl = `${environment.apiUrl}/settlements`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<{ data: AdminDashboardStats }> {
    return this.http.get<{ data: AdminDashboardStats }>(`${this.apiUrl}/dashboard-stats`);
  }

  getBuyingPools(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/buying-pools`);
  }

  getBuyingRequests(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/buying-requests`);
  }

  getSettlements(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.settlementsUrl}`);
  }

  holdSettlement(id: string): Observable<{ data: any }> {
    return this.http.patch<{ data: any }>(`${this.settlementsUrl}/${id}/hold`, {});
  }

  releaseSettlement(id: string): Observable<{ data: any }> {
    return this.http.patch<{ data: any }>(`${this.settlementsUrl}/${id}/release`, {});
  }
}

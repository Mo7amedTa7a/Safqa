import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deal } from '../models/deal.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private baseUrl = 'http://localhost:3000/api/deals';

  constructor(private http: HttpClient) {}

  getDeals(): Observable<ApiResponse<Deal[]>> {
    return this.http.get<ApiResponse<Deal[]>>(this.baseUrl);
  }

  getDealById(id: string): Observable<ApiResponse<Deal>> {
    return this.http.get<ApiResponse<Deal>>(`${this.baseUrl}/${id}`);
  }

  updateDealStatus(id: string, status: string): Observable<ApiResponse<Deal>> {
    return this.http.patch<ApiResponse<Deal>>(`${this.baseUrl}/${id}/status`, {
      status,
    });
  }
}

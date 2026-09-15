import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  BuyingRequest,
  BuyingRequestListResponse,
  BuyingRequestResponse,
  CreateBuyingRequestDto,
  UpdateBuyingRequestDto
} from '../models/buying-request.model';

@Injectable({
  providedIn: 'root'
})
export class BuyingRequestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createRequest(data: CreateBuyingRequestDto): Observable<BuyingRequest> {
    return this.http
      .post<BuyingRequestResponse>(`${this.apiUrl}/buying-requests`, data)
      .pipe(map(response => response.data));
  }

  getMyRequests(): Observable<BuyingRequest[]> {
    // The current backend exposes GET /api/buying-requests/.
    return this.http
      .get<BuyingRequestListResponse>(`${this.apiUrl}/buying-requests`)
      .pipe(map(response => response.data));
  }

  getRequestById(id: string): Observable<BuyingRequest> {
    return this.http
      .get<BuyingRequestResponse>(`${this.apiUrl}/buying-requests/${id}`)
      .pipe(map(response => response.data));
  }

  updateRequest(
    id: string,
    data: UpdateBuyingRequestDto
  ): Observable<BuyingRequest> {
    return this.http
      .patch<BuyingRequestResponse>(
        `${this.apiUrl}/buying-requests/${id}`,
        data
      )
      .pipe(map(response => response.data));
  }

  cancelRequest(id: string): Observable<BuyingRequest> {
    return this.http
      .patch<BuyingRequestResponse>(
        `${this.apiUrl}/buying-requests/${id}/cancel`,
        {}
      )
      .pipe(map(response => response.data));
  }
}

// Member 3 - Buying Pool Service
// getPools(filters?)      → GET    /api/buying-pools
// getPoolById(id)         → GET    /api/buying-pools/:id
// createPool(data)        → POST   /api/buying-pools
// joinPool(poolId, data)  → POST   /api/buying-pools/:poolId/members
// updateQuantity(poolId)  → PATCH  /api/buying-pools/:poolId/members/me
// leavePool(poolId)       → DELETE /api/buying-pools/:poolId/members/me
// closePool(poolId)       → PATCH  /api/buying-pools/:poolId/close  [Admin]
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  BuyingPoolDetailsResponse,
  BuyingPoolListResponse,
  CreateBuyingPoolRequest,
  JoinPoolResponse,
  UpdateQuantityRequest,
  UpdateQuantityResponse,
  LeavePoolResponse
} from '../models/buying-pool.model';

@Injectable({
  providedIn: 'root'
})
export class BuyingPoolService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/buying-pools`;

  // GET /api/buying-pools
  getBuyingPools(): Observable<BuyingPoolListResponse> {
    return this.http.get<BuyingPoolListResponse>(
      this.apiUrl
    );
  }

  // GET /api/buying-pools/:id
  getBuyingPoolById(id: string): Observable<BuyingPoolDetailsResponse> {
    return this.http.get<BuyingPoolDetailsResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  // POST /api/buying-pools
  createPool(data: CreateBuyingPoolRequest): Observable<BuyingPoolDetailsResponse> {
    return this.http.post<BuyingPoolDetailsResponse>(
      this.apiUrl,
      data
    );
  }

  // POST /api/pool-members/:id/join
  joinPool(poolId: string): Observable<JoinPoolResponse> {
    return this.http.post<JoinPoolResponse>(
      `${environment.apiUrl}/pool-members/${poolId}/join`,
      null
    );
  }

  // PATCH /api/pool-members/:id/members/me
  updateQuantity(poolId: string, data: UpdateQuantityRequest ): Observable<UpdateQuantityResponse> {
    return this.http.patch<UpdateQuantityResponse>(
      `${environment.apiUrl}/pool-members/${poolId}/members/me`,
      data
    );
  }

  // DELETE /api/pool-members/:id/members/me
  leavePool( poolId: string): Observable<LeavePoolResponse> {
    return this.http.delete<LeavePoolResponse>(
      `${environment.apiUrl}/pool-members/${poolId}/members/me`
    );
  }

  // POST /api/buying-pools/:id/close
  closePool( poolId: string ): Observable<BuyingPoolDetailsResponse> {
    return this.http.post<BuyingPoolDetailsResponse>(
      `${this.apiUrl}/${poolId}/close`,
      null
    );
  }
}
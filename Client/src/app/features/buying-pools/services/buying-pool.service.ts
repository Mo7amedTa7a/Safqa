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
  BuyingPool,
  BuyingPoolDetailsResponse,
  BuyingPoolListResponse
} from '../models/buying-pool.model';

@Injectable({
  providedIn: 'root'
})
export class BuyingPoolService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/buying-pools`;

  getBuyingPools(): Observable<BuyingPoolListResponse> {
    return this.http.get<BuyingPoolListResponse>(this.apiUrl);
  }

  getBuyingPoolById(id: string): Observable<BuyingPoolDetailsResponse> {
    return this.http.get<BuyingPoolDetailsResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  CreateSupplierOfferRequest,
  SupplierOffer,
  SupplierOfferResponse
} from '../models/supplier-offer.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierOfferService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/supplier-offers`;

  // Create Offer
  createOffer(
    poolId: string,
    data: CreateSupplierOfferRequest
  ): Observable<SupplierOfferResponse> {
    return this.http.post<SupplierOfferResponse>(
      `${this.apiUrl}/${poolId}/offers`,
      data
    );
  }

  // Update Offer
  updateOffer(
    offerId: string,
    data: Partial<CreateSupplierOfferRequest>
  ): Observable<SupplierOfferResponse> {
    return this.http.patch<SupplierOfferResponse>(
      `${this.apiUrl}/${offerId}`,
      data
    );
  }

  // Withdraw Offer
  withdrawOffer(
    offerId: string
  ): Observable<SupplierOfferResponse> {
    return this.http.patch<SupplierOfferResponse>(
      `${this.apiUrl}/${offerId}/withdraw`,
      null
    );
  }

  // Get Offers For Pool
  getOffersForPool(
    poolId: string
  ): Observable<{
    success: boolean;
    data: SupplierOffer[];
  }> {
    return this.http.get<{
      success: boolean;
      data: SupplierOffer[];
    }>(
      `${this.apiUrl}/${poolId}/offers`
    );
  }

  getOfferById(
    offerId: string
  ): Observable<SupplierOfferResponse> {
    return this.http.get<SupplierOfferResponse>(
      `${this.apiUrl}/${offerId}`
    );
  }

  getMyOffers(): Observable<{
    success: boolean;
    data: SupplierOffer[];
  }> {
    return this.http.get<{
      success: boolean;
      data: SupplierOffer[];
    }>(
      `${this.apiUrl}/my`
    );
  }
}
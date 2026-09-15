import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Settlement } from '../models/settlement.model';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {
  private apiUrl = `${environment.apiUrl}/settlements`;

  constructor(private http: HttpClient) {}

  getSettlements(filters?: any): Observable<{ message: string, data: Settlement[] }> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<{ message: string, data: Settlement[] }>(this.apiUrl, { params });
  }

  getSettlementById(id: string): Observable<{ message: string, data: Settlement }> {
    return this.http.get<{ message: string, data: Settlement }>(`${this.apiUrl}/${id}`);
  }

  holdSettlement(id: string): Observable<{ message: string, data: Settlement }> {
    return this.http.patch<{ message: string, data: Settlement }>(`${this.apiUrl}/${id}/hold`, {});
  }

  releaseSettlement(id: string): Observable<{ message: string, data: Settlement }> {
    return this.http.patch<{ message: string, data: Settlement }>(`${this.apiUrl}/${id}/release`, {});
  }
}

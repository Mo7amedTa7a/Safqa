import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupplierProfile } from '../models/supplier-profile.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierProfileService {
  private apiUrl = `${environment.apiUrl}/supplier-profiles`;

  private profileSubject = new BehaviorSubject<SupplierProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get currentProfileValue(): SupplierProfile | null {
    return this.profileSubject.value;
  }

  // Create or update supplier profile (for newly registered suppliers)
  createProfile(profileData: Partial<SupplierProfile>): Observable<ApiResponse<SupplierProfile>> {
    return this.http.post<ApiResponse<SupplierProfile>>(this.apiUrl, profileData).pipe(
      tap(res => {
        if (res.data) {
          this.profileSubject.next(res.data);
        }
      })
    );
  }

  // Get current logged-in supplier's own profile
  getMyProfile(): Observable<ApiResponse<SupplierProfile>> {
    return this.http.get<ApiResponse<SupplierProfile>>(`${this.apiUrl}/me`).pipe(
      tap(res => {
        if (res.data) {
          this.profileSubject.next(res.data);
        }
      })
    );
  }

  // Admin approves supplier
  approveSupplier(profileId: string): Observable<ApiResponse<SupplierProfile>> {
    return this.http.patch<ApiResponse<SupplierProfile>>(`${this.apiUrl}/${profileId}/approve`, {}).pipe(
      tap(res => {
        if (res.data && this.profileSubject.value?._id === profileId) {
          this.profileSubject.next(res.data);
        }
      })
    );
  }

  // Admin rejects supplier with reason
  rejectSupplier(profileId: string, rejectionReason: string): Observable<ApiResponse<SupplierProfile>> {
    return this.http.patch<ApiResponse<SupplierProfile>>(`${this.apiUrl}/${profileId}/reject`, { rejectionReason }).pipe(
      tap(res => {
        if (res.data && this.profileSubject.value?._id === profileId) {
          this.profileSubject.next(res.data);
        }
      })
    );
  }

  // Get all supplier profiles for admin review
  getAllProfiles(): Observable<ApiResponse<SupplierProfile[]>> {
    return this.http.get<ApiResponse<SupplierProfile[]>>(this.apiUrl);
  }
}


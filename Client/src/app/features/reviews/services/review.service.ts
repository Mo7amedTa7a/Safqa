import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createReview(orderId: string, data: { reviewedUser: string; rating: number; comment?: string }): Observable<{ message: string, data: Review }> {
    return this.http.post<{ message: string, data: Review }>(`${this.apiUrl}/reviews/orders/${orderId}`, data);
  }

  getReviewsByUser(userId: string): Observable<{ message: string, data: Review[] }> {
    return this.http.get<{ message: string, data: Review[] }>(`${this.apiUrl}/reviews/users/${userId}`);
  }
}

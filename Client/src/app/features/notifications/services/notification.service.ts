import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<{ message: string, data: AppNotification[] }> {
    return this.http.get<{ message: string, data: AppNotification[] }>(`${this.apiUrl}/notifications`);
  }

  markAsRead(id: string): Observable<{ message: string, data: AppNotification }> {
    return this.http.patch<{ message: string, data: AppNotification }>(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/notifications/read-all`, {});
  }
}

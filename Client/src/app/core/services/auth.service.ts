import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // State for the currently logged in user
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadUserFromStorage();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  public hasRole(roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return roles.includes(user.role);
  }

  public getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  login(credentials: any): Observable<ApiResponse<{ user: User; token: string }>> {
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.data && response.data.token) {
          this.setSession(response.data.user, response.data.token);
        }
      })
    );
  }

  register(userData: any): Observable<ApiResponse<{ user: User; token: string }>> {
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response.data && response.data.token) {
          this.setSession(response.data.user, response.data.token);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  private setSession(user: User, token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    if (this.isBrowser) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          this.currentUserSubject.next(user);
        } catch (e) {
          this.logout();
        }
      }
    }
  }
}

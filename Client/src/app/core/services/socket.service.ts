import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { AppNotification } from '../../features/notifications/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private newNotification$ = new Subject<AppNotification>();

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.currentUser$.subscribe(user => {
        if (user && user._id) {
          this.connect(user._id);
        } else {
          this.disconnect();
        }
      });
    }
  }

  private connect(userId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.socket && this.socket.connected) {
      this.socket.emit('join', userId);
      return;
    }

    try {
      const socketUrl = environment.apiUrl.replace(/\/api\/?$/, '');
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('[Socket.io Client] Connected to server, joining room for user:', userId);
        this.socket?.emit('join', userId);
      });

      this.socket.on('new_notification', (notification: AppNotification) => {
        console.log('[Socket.io Client] Real-time notification received:', notification);
        this.newNotification$.next(notification);
      });
    } catch (err) {
      console.error('[Socket.io Client] Connection error:', err);
    }
  }

  private disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewNotification(): Observable<AppNotification> {
    return this.newNotification$.asObservable();
  }
}

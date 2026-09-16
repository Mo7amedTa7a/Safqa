import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../features/notifications/services/notification.service';
import { SocketService } from '../../core/services/socket.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private socketService = inject(SocketService);
  private router = inject(Router);

  currentUser: User | null = null;
  unreadNotificationsCount = 0;
  private authSub?: Subscription;
  private socketSub?: Subscription;
  isMobileMenuOpen = false;

  ngOnInit(): void {
    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUnreadCount();
      }
    });

    if (this.socketService) {
      this.socketSub = this.socketService.onNewNotification()?.subscribe(() => {
        this.unreadNotificationsCount++;
      });
    }
  }

  loadUnreadCount(): void {
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.unreadNotificationsCount = res.data.filter(n => !n.isRead).length;
        }
      },
      error: () => {}
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.socketSub?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}

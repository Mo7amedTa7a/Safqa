import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../features/notifications/services/notification.service';
import { SocketService } from '../../core/services/socket.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Input() showSidebarToggle = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser: User | null = null;
  UserRole = UserRole;
  unreadNotificationsCount = 0;

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUnreadCount();
      }
    });

    if (this.socketService) {
      this.socketService.onNewNotification()?.subscribe(() => {
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

  getRoleLabel(role?: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'مدير النظام';
      case UserRole.SUPPLIER: return 'مورد معتمد';
      case UserRole.SHIPPING_PARTNER: return 'شريك لوجستي';
      default: return 'مشتري معتمد';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
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

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
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

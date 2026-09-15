import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { SupplierProfileService } from '../../../core/services/supplier-profile.service';
import { User, UserRole } from '../../../core/models/user.model';
import { SupplierProfile } from '../../../core/models/supplier-profile.model';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  user: User | null = null;
  supplierProfile: SupplierProfile | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  UserRole = UserRole;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private supplierService: SupplierProfileService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getMe().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.user = res.data;
        if (this.user) {
          this.authService.updateUser(this.user);
          if (this.user.role === UserRole.SUPPLIER) {
            this.loadSupplierProfile();
          }
        }
      },
      error: () => {
        this.isLoading = false;
        // Fallback to local session user if offline/network error
        this.user = this.authService.currentUserValue;
        if (this.user?.role === UserRole.SUPPLIER) {
          this.loadSupplierProfile();
        }
      }
    });
  }

  loadSupplierProfile(): void {
    this.supplierService.getMyProfile().subscribe({
      next: (res) => {
        this.supplierProfile = res.data || null;
      },
      error: () => {
        this.supplierProfile = null;
      }
    });
  }

  getRoleBadgeClass(role?: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'badge-safqa-danger';
      case UserRole.SUPPLIER: return 'badge-safqa-secondary';
      case UserRole.SHIPPING_PARTNER: return 'badge-safqa-primary';
      default: return 'badge-safqa-success';
    }
  }

  getRoleTitle(role?: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'مدير النظام (Admin)';
      case UserRole.SUPPLIER: return 'مورد معتمد (Supplier)';
      case UserRole.SHIPPING_PARTNER: return 'شريك شحن وتوصيل';
      default: return 'مشتري معتمد (Buyer)';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css'
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm = '';
  selectedRoleFilter: string = 'ALL';

  UserRole = UserRole;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.users = res.data || [];
        this.applyFilter();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'تعذر تحميل قائمة المستخدمين.';
      }
    });
  }

  applyFilter(): void {
    this.filteredUsers = this.users.filter(u => {
      const matchSearch = (u.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           u.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           u.phone?.includes(this.searchTerm));
      const matchRole = this.selectedRoleFilter === 'ALL' || u.role === this.selectedRoleFilter;
      return matchSearch && matchRole;
    });
  }

  toggleDeactivate(user: User): void {
    if (!confirm(`هل أنت متأكد من تغيير حالة حساب المستخدم "${user.name}"؟`)) {
      return;
    }

    this.userService.deactivateUser(user._id).subscribe({
      next: () => {
        user.isActive = !user.isActive;
      },
      error: (err) => {
        alert(err.error?.message || 'فشلت العملية.');
      }
    });
  }

  getRoleBadge(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'badge-safqa-danger';
      case UserRole.SUPPLIER: return 'badge-safqa-secondary';
      case UserRole.SHIPPING_PARTNER: return 'badge-safqa-primary';
      default: return 'badge-safqa-success';
    }
  }

  getRoleName(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'مدير النظام';
      case UserRole.SUPPLIER: return 'مورد';
      case UserRole.SHIPPING_PARTNER: return 'شريك لوجستي';
      default: return 'مشتري';
    }
  }
}

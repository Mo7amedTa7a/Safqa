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
  successMessage: string | null = null;
  searchTerm = '';
  selectedRoleFilter: string = 'ALL';

  showModal = false;
  isEditMode = false;
  selectedUserId: string | null = null;
  isSubmitting = false;

  formData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: UserRole.SHIPPING_PARTNER
  };

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

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.formData = {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: UserRole.SHIPPING_PARTNER
    };
    this.errorMessage = null;
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditMode = true;
    this.selectedUserId = user._id;
    this.formData = {
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.role
    };
    this.errorMessage = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveUser(): void {
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.isEditMode && this.selectedUserId) {
      const updatePayload: any = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        role: this.formData.role
      };
      if (this.formData.password) {
        updatePayload.password = this.formData.password;
      }

      this.userService.updateUser(this.selectedUserId, updatePayload).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.successMessage = 'تم تحديث بيانات ومستويات الحساب بنجاح.';
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحديث بيانات الحساب.';
        }
      });
    } else {
      this.userService.createUser(this.formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.successMessage = 'تم إنشاء الحساب بنجاح وتعيين الصلاحيات.';
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'حدث خطأ أثناء إنشاء الحساب.';
        }
      });
    }
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
      case UserRole.ADMIN: return 'مدير النظام (Admin)';
      case UserRole.SUPPLIER: return 'مورد';
      case UserRole.SHIPPING_PARTNER: return 'شركة شحن (Logistics)';
      default: return 'مشتري';
    }
  }
}

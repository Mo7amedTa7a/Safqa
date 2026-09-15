import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SupplierProfileService } from '../../core/services/supplier-profile.service';
import { OrderService } from '../../core/services/order.service';
import { User, UserRole } from '../../core/models/user.model';
import { SupplierProfile } from '../../core/models/supplier-profile.model';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-supplier-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-dashboard.component.html',
  styleUrl: './supplier-dashboard.component.css'
})
export class SupplierDashboardComponent implements OnInit {
  currentUser: User | null = null;
  supplierProfile: SupplierProfile | null = null;
  isPendingSupplier = false;
  isRejectedSupplier = false;
  rejectionReason: string | null = null;
  isLoadingProfile = true;
  UserRole = UserRole;
  
  recentOrders: Order[] = [];
  totalProfit = 0;
  
  supplierKpiStats = [
    { value: '0', label: 'إجمالي الطلبات', icon: 'bi-box-seam' },
    { value: '0 ج.م', label: 'إجمالي الأرباح', icon: 'bi-cash-coin' },
    { value: '0', label: 'طلبات قيد التنفيذ', icon: 'bi-hourglass-split' },
    { value: '0', label: 'التقييم العام', icon: 'bi-star-fill' }
  ];

  constructor(
    private authService: AuthService,
    private supplierService: SupplierProfileService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u && u.role === UserRole.SUPPLIER) {
        this.loadSupplierStatus();
      }
    });

    this.supplierService.profile$.subscribe(profile => {
      if (this.currentUser?.role === UserRole.SUPPLIER && profile) {
        this.supplierProfile = profile;
        this.evaluateStatus(profile);
      }
    });
  }

  loadSupplierStatus(): void {
    this.isLoadingProfile = true;
    this.supplierService.getMyProfile().subscribe({
      next: (res) => {
        this.isLoadingProfile = false;
        this.supplierProfile = res.data || null;
        if (this.supplierProfile) {
          this.evaluateStatus(this.supplierProfile);
          this.loadDashboardData();
        } else {
          this.isPendingSupplier = true;
        }
      },
      error: () => {
        this.isLoadingProfile = false;
        this.isPendingSupplier = true;
      }
    });
  }

  private evaluateStatus(profile: SupplierProfile): void {
    if (profile.verificationStatus === 'APPROVED') {
      this.isPendingSupplier = false;
      this.isRejectedSupplier = false;
    } else if (profile.verificationStatus === 'REJECTED') {
      this.isPendingSupplier = false;
      this.isRejectedSupplier = true;
      this.rejectionReason = profile.rejectionReason || null;
    } else {
      this.isPendingSupplier = true;
      this.isRejectedSupplier = false;
    }
  }

  loadDashboardData(): void {
    if (this.isPendingSupplier || this.isRejectedSupplier) return;
    
    this.orderService.getOrders().subscribe({
      next: (res) => {
        const orders = res.data || [];
        this.recentOrders = orders.slice(0, 5); // Take top 5 recent orders
        
        const pendingCount = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
        this.totalProfit = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        this.supplierKpiStats = [
          { value: `${orders.length}`, label: 'إجمالي الطلبات', icon: 'bi-box-seam' },
          { value: `${this.totalProfit.toLocaleString('en-US')} ج.م`, label: 'إجمالي الأرباح', icon: 'bi-cash-coin' },
          { value: `${pendingCount}`, label: 'طلبات قيد التنفيذ', icon: 'bi-hourglass-split' },
          { value: `${this.currentUser?.rating || 0}`, label: 'التقييم العام', icon: 'bi-star-fill' }
        ];
      },
      error: (err) => console.error('Error loading orders', err)
    });
  }

  getRoleLabel(): string {
    return this.isPendingSupplier ? 'مورد (قيد المراجعة)' : 'مورد معتمد';
  }
}

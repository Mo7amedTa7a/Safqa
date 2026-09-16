import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { BuyingRequestService } from '../buying-requests/services/buying-request.service';
import { User, UserRole } from '../../core/models/user.model';
import { Order } from '../../core/models/order.model';
import { BuyingRequest } from '../buying-requests/models/buying-request.model';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buyer-dashboard.component.html',
  styleUrl: './buyer-dashboard.component.css'
})
export class BuyerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  UserRole = UserRole;

  myRequests: BuyingRequest[] = [];
  recentRequests: BuyingRequest[] = [];
  recentOrders: Order[] = [];

  totalPurchasesCount = 0;
  totalSavings = 0;
  activeRequestsCount = 0;
  completedCount = 0;
  isLoading = true;

  buyerKpiStats: { value: string; label: string; icon: string; bgClass: string; colorClass: string }[] = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private buyingRequestService: BuyingRequestService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u && u.role === UserRole.BUYER) {
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load buyer's own requests
    this.buyingRequestService.getMyRequests().subscribe({
      next: (requests) => {
        this.myRequests = requests || [];
        this.recentRequests = this.myRequests.slice(0, 3);
        this.activeRequestsCount = this.myRequests.filter(r => ['OPEN', 'PENDING', 'POOLED'].includes(r.status)).length;
        
        this.loadOrdersData();
      },
      error: (err) => {
        console.error('Error loading buying requests for buyer dashboard:', err);
        this.loadOrdersData();
      }
    });
  }

  private loadOrdersData(): void {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        const orders = res.data || [];
        this.recentOrders = orders.slice(0, 5);
        
        const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED');
        this.completedCount = completedOrders.length;

        this.totalPurchasesCount = this.myRequests.length + orders.length;

        // Money saved is calculated ONLY after sale completion and delivery (DELIVERED / COMPLETED status)
        const completedTotalAmount = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        this.totalSavings = Math.round(completedTotalAmount * 0.25);

        this.buyerKpiStats = [
          {
            value: `${this.totalPurchasesCount}`,
            label: 'إجمالي عمليات الشراء والطلبات',
            icon: 'bi-bag-check-fill',
            bgClass: 'bg-primary-subtle',
            colorClass: 'text-primary'
          },
          {
            value: `${this.totalSavings.toLocaleString('en-US')} ج.م`,
            label: 'إجمالي الوفر المالي المكتسب',
            icon: 'bi-piggy-bank-fill',
            bgClass: 'bg-success-subtle',
            colorClass: 'text-success'
          },
          {
            value: `${this.activeRequestsCount}`,
            label: 'طلبات قيد الجمع والتفاوض',
            icon: 'bi-hourglass-split',
            bgClass: 'bg-warning-subtle',
            colorClass: 'text-warning'
          },
          {
            value: `${this.completedCount}`,
            label: 'طلبات مكتملة ومسلمة',
            icon: 'bi-check-circle-fill',
            bgClass: 'bg-info-subtle',
            colorClass: 'text-info'
          }
        ];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders for buyer dashboard:', err);
        this.isLoading = false;
      }
    });
  }

  getProductName(product: any): string {
    if (!product) return 'طلب شراء';
    if (typeof product === 'string') return product;
    return product.name || product.title || 'منتج غير مسمى';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'bg-success-subtle text-success border-success-subtle';
      case 'POOLED':
        return 'bg-info-subtle text-info border-info-subtle';
      case 'PENDING':
        return 'bg-warning-subtle text-warning border-warning-subtle';
      case 'COMPLETED':
      case 'FULFILLED':
        return 'bg-primary-subtle text-primary border-primary-subtle';
      case 'CANCELLED':
        return 'bg-danger-subtle text-danger border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary border-secondary-subtle';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'مفتوح واستقبال العروض';
      case 'POOLED':
        return 'منضم لتجمع شراء';
      case 'PENDING':
        return 'قيد التجميع والمراجعة';
      case 'COMPLETED':
      case 'FULFILLED':
        return 'مكتمل ومسلم';
      case 'CANCELLED':
        return 'ملغي';
      default:
        return status || 'نشط';
    }
  }

  getRoleLabel(role?: string): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'مسؤول النظام';
      case UserRole.BUYER:
        return 'مشتري معتمد';
      default:
        return 'عضو';
    }
  }
}


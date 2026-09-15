import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { User, UserRole } from '../../core/models/user.model';
import { Order } from '../../core/models/order.model';

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
  
  recentOrders: Order[] = [];
  totalSpending = 0;

  buyerKpiStats = [
    { value: '0', label: 'إجمالي الطلبات', icon: 'bi-bag-check' },
    { value: '0 ج.م', label: 'إجمالي المشتريات', icon: 'bi-cash-stack' }
  ];

  constructor(
    private authService: AuthService,
    private orderService: OrderService
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
    this.orderService.getOrders().subscribe({
      next: (res) => {
        const orders = res.data || [];
        this.recentOrders = orders.slice(0, 5); // Take top 5
        
        this.totalSpending = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        this.buyerKpiStats = [
          { value: `${orders.length}`, label: 'إجمالي الطلبات', icon: 'bi-bag-check' },
          { value: `${this.totalSpending.toLocaleString('en-US')} ج.م`, label: 'إجمالي المشتريات', icon: 'bi-cash-stack' }
        ];
      },
      error: (err) => console.error('Error loading orders', err)
    });
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

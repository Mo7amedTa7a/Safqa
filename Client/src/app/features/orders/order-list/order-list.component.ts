import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {

  orders: Order[] = [];

  isLoading = true;

  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.isLoading = true;

    this.orderService.getOrders().subscribe({

      next: (response) => {

        this.orders = response.data ?? [];

        this.isLoading = false;

      },

      error: () => {

        this.errorMessage = 'حدث خطأ أثناء تحميل الطلبات';

        this.isLoading = false;

      }

    });

  }

  getSupplierName(order: Order): string {
    if (typeof order.supplier === 'string') {
      return 'المورد';
    }
    return order.supplier?.name ?? 'مورد غير معروف';
  }

  getProduct(order: any): any {
    if (order.buyingRequest?.product) {
      return order.buyingRequest.product;
    }
    if (order.deal?.buyingRequest?.product) {
      return order.deal.buyingRequest.product;
    }
    if (order.deal?.pool?.product) {
      return order.deal.pool.product;
    }
    return null;
  }

  confirmOrder(orderId: string): void {
    if (!confirm('هل تريد تأكيد الطلب وإرساله للتوريد والشحن؟')) return;
    this.orderService.confirmOrder(orderId).subscribe({
      next: () => {
        alert('تم تأكيد طلبك بنجاح! جاري التنسيق مع المورد وشركة الشحن.');
        this.loadOrders();
      },
      error: (err) => {
        alert(err?.error?.message || 'تعذر تأكيد الطلب');
      }
    });
  }

  cancelOrder(orderId: string): void {
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        alert('تم إلغاء الطلب.');
        this.loadOrders();
      },
      error: (err) => {
        alert(err?.error?.message || 'تعذر إلغاء الطلب');
      }
    });
  }

  isBuyer(): boolean {
    return this.authService.hasRole([UserRole.BUYER]);
  }
}


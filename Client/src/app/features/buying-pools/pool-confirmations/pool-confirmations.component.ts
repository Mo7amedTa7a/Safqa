import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../orders/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order, ShippingAddress } from '../../orders/models/order.model';
import { User } from '../../../core/models/user.model';

interface PendingOrderForm {
  order: Order;
  phone: string;
  street: string;
  city: string;
  country: string;
  isConfirming: boolean;
}

@Component({
  selector: 'app-pool-confirmations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pool-confirmations.component.html',
  styleUrl: './pool-confirmations.component.css'
})
export class PoolConfirmationsComponent implements OnInit {
  currentUser: User | null = null;
  pendingForms: PendingOrderForm[] = [];
  confirmedOrders: Order[] = [];
  
  isLoading = true;
  errorMessage = '';
  activeTab: 'pending' | 'confirmed' = 'pending';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      this.loadGroupOrders();
    });
  }

  loadGroupOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getOrders().subscribe({
      next: (res) => {
        const allOrders = res.data || [];

        // Pending orders awaiting buyer confirmation
        const pending = allOrders.filter(o => o.status === 'PENDING');
        this.pendingForms = pending.map(order => ({
          order,
          phone: order.phone || this.currentUser?.phone || '',
          street: order.shippingAddress?.street || this.currentUser?.address?.street || 'العنوان المحلي للمشتري',
          city: order.shippingAddress?.city || this.currentUser?.address?.city || 'القاهرة',
          country: order.shippingAddress?.country || this.currentUser?.address?.country || 'مصر',
          isConfirming: false
        }));

        // Confirmed orders sent to winning supplier
        this.confirmedOrders = allOrders.filter(o => o.status !== 'PENDING' && o.status !== 'CANCELLED');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching group orders:', err);
        this.errorMessage = 'تعذر تحميل الطلبات الجماعية بانتظار التأكيد';
        this.isLoading = false;
      }
    });
  }

  confirmOrder(form: PendingOrderForm): void {
    if (!form.phone.trim()) {
      alert('يرجى كتابة رقم الهاتف للتواصل عند التسليم');
      return;
    }
    if (!form.street.trim()) {
      alert('يرجى كتابة عنوان التوصيل');
      return;
    }

    form.isConfirming = true;

    const shippingAddress: ShippingAddress = {
      street: form.street,
      city: form.city,
      country: form.country
    };

    this.orderService.confirmOrder(form.order._id, {
      phone: form.phone,
      shippingAddress
    }).subscribe({
      next: () => {
        alert('🎉 تم تأكيد الطلب بنجاح! تم إرسال الأوردر وبيانات الشحن فوراً للمورد الفائز بالصفقة للبدء في التجهيز.');
        form.isConfirming = false;
        this.loadGroupOrders();
      },
      error: (err) => {
        alert(err?.error?.message || 'تعذر تأكيد الطلب، يرجى المحاولة مرة أخرى.');
        form.isConfirming = false;
      }
    });
  }

  getSupplierName(order: Order): string {
    if (!order.supplier) return 'المورد الفائز بالصفقة';
    if (typeof order.supplier === 'string') return order.supplier;
    return order.supplier.name || 'مورد صفقة معتمد';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-primary-subtle text-primary border-primary-subtle';
      case 'READY_FOR_PICKUP':
        return 'bg-info-subtle text-info border-info-subtle';
      case 'SHIPPED':
        return 'bg-warning-subtle text-warning border-warning-subtle';
      case 'DELIVERED':
        return 'bg-success-subtle text-success border-success-subtle';
      default:
        return 'bg-secondary-subtle text-secondary border-secondary-subtle';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'تم التأكيد - جاري التجهيز بالمورد';
      case 'READY_FOR_PICKUP':
        return 'جاهز للاستلام وتجهيز الشحن';
      case 'SHIPPED':
        return 'جاري الشحن مع شركة اللوجستيات';
      case 'DELIVERED':
        return 'تم التوصيل والاستلام بنجاح';
      default:
        return status;
    }
  }
}

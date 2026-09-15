import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';

import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {

  order: Order | null = null;

  isLoading = true;
  isUpdating = false;

  errorMessage = '';
  actionMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'معرف الطلب غير موجود';
      this.isLoading = false;
      return;
    }

    this.orderService.getOrderById(id).subscribe({

      next: (response) => {
        this.order = response.data;
        this.isLoading = false;
      },

      error: () => {
        this.errorMessage = 'حدث خطأ أثناء تحميل تفاصيل الطلب';
        this.isLoading = false;
      }

    });
  }

  // =========================
  // User Roles
  // =========================

  isBuyer(): boolean {
    return this.authService.hasRole([UserRole.BUYER]);
  }

  isSupplier(): boolean {
    return this.authService.hasRole([UserRole.SUPPLIER]);
  }

  // =========================
  // Order Actions
  // =========================

  canCancel(): boolean {
    if (!this.order || !this.isBuyer()) {
      return false;
    }

    return (
      this.order.status === 'PENDING' ||
      this.order.status === 'CONFIRMED'
    );
  }

  canConfirm(): boolean {
    return this.isSupplier() && this.order?.status === 'PENDING';
  }

  canMarkReadyForPickup(): boolean {
    return this.isSupplier() && this.order?.status === 'CONFIRMED';
  }

  canShip(): boolean {
    return this.isSupplier() && this.order?.status === 'READY_FOR_PICKUP';
  }

  canDeliver(): boolean {
    return this.isSupplier() && this.order?.status === 'SHIPPED';
  }

  // =========================
  // Status Updates
  // =========================

  confirmOrder(): void {
    if (!this.order || !this.canConfirm()) {
      return;
    }

    this.updateStatus('CONFIRMED');
  }

  markReadyForPickup(): void {
    if (!this.order || !this.canMarkReadyForPickup()) {
      return;
    }

    this.isUpdating = true;
    this.actionMessage = '';

    this.orderService.markReadyForPickup(this.order._id).subscribe({

      next: (response) => {
        this.order = response.data;
        this.isUpdating = false;
        this.actionMessage = 'تم تحديث الطلب إلى جاهز للاستلام';
      },

      error: (err) => {
        this.isUpdating = false;
        this.actionMessage =
          err?.error?.message || 'حدث خطأ أثناء تحديث حالة الطلب';
      }

    });
  }

  shipOrder(): void {
    if (!this.order || !this.canShip()) {
      return;
    }

    this.updateStatus('SHIPPED');
  }

  deliverOrder(): void {
    if (!this.order || !this.canDeliver()) {
      return;
    }

    this.updateStatus('DELIVERED');
  }

  updateStatus(status: string): void {

    if (!this.order) {
      return;
    }

    this.isUpdating = true;
    this.actionMessage = '';

    this.orderService
      .updateOrderStatus(this.order._id, status)
      .subscribe({

        next: (response) => {
          this.order = response.data;
          this.isUpdating = false;
          this.actionMessage = 'تم تحديث حالة الطلب بنجاح';
        },

        error: (err) => {
          this.isUpdating = false;
          this.actionMessage =
            err?.error?.message || 'حدث خطأ أثناء تحديث حالة الطلب';
        }

      });
  }

  cancelOrder(): void {

    if (!this.order || !this.canCancel()) {
      return;
    }

    const confirmed = window.confirm(
      'هل أنت متأكد من إلغاء هذا الطلب؟'
    );

    if (!confirmed) {
      return;
    }

    this.isUpdating = true;
    this.actionMessage = '';

    this.orderService
      .cancelOrder(this.order._id)
      .subscribe({

        next: (response) => {
          this.order = response.data;
          this.isUpdating = false;
          this.actionMessage = 'تم إلغاء الطلب بنجاح';
        },

        error: (err) => {
          this.isUpdating = false;
          this.actionMessage =
            err?.error?.message || 'حدث خطأ أثناء إلغاء الطلب';
        }

      });
  }

  // =========================
  // Status Timeline
  // =========================

  getStatusSteps(): string[] {
    return [
      'PENDING',
      'CONFIRMED',
      'READY_FOR_PICKUP',
      'SHIPPED',
      'DELIVERED'
    ];
  }

  isStatusCompleted(status: string): boolean {

    if (!this.order) {
      return false;
    }

    const steps = this.getStatusSteps();

    const currentIndex = steps.indexOf(this.order.status);
    const statusIndex = steps.indexOf(status);

    if (currentIndex === -1 || statusIndex === -1) {
      return false;
    }

    return statusIndex <= currentIndex;
  }

  getStatusLabel(status: string): string {

    const labels: Record<string, string> = {
      PENDING: 'قيد الانتظار',
      CONFIRMED: 'تم التأكيد',
      READY_FOR_PICKUP: 'جاهز للاستلام',
      SHIPPED: 'تم الشحن',
      DELIVERED: 'تم التوصيل',
      RETURNED: 'تم الإرجاع',
      CANCELLED: 'ملغي'
    };

    return labels[status] ?? status;
  }

  // =========================
  // Display Helpers
  // =========================

  getSupplierName(): string {
    return this.order?.supplier?.name ?? 'مورد غير معروف';
  }

  getBuyerName(): string {
    return this.order?.buyer?.name ?? 'عميل غير معروف';
  }

}

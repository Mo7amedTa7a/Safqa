import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';

import { DealService } from '../services/deal.service';
import { Deal } from '../models/deal.model';

import { OrderService } from '../../orders/services/order.service';
import { ShippingAddress } from '../../orders/models/order.model';

import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deal-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './deal-details.component.html',
  styleUrl: './deal-details.component.css'
})
export class DealDetailsComponent implements OnInit {

  deal: Deal | null = null;

  isLoading = true;
  errorMessage = '';

  // Order creation
  showOrderForm = false;
  isCreatingOrder = false;
  orderSuccessMessage = '';
  orderErrorMessage = '';

  shippingAddress: ShippingAddress = {
    street: '',
    city: '',
    country: ''
  };

  phone = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dealService: DealService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDeal();
  }

  loadDeal(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'معرف الصفقة غير موجود';
      this.isLoading = false;
      return;
    }

    this.dealService.getDealById(id).subscribe({
      next: (response) => {
        this.deal = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء تحميل تفاصيل الصفقة';
        this.isLoading = false;
      }
    });
  }

  isBuyer(): boolean {
    return this.authService.hasRole([UserRole.BUYER]);
  }

  canCreateOrder(): boolean {
    return (
      this.isBuyer() &&
      this.deal?.status === 'ACTIVE'
    );
  }

  openOrderForm(): void {
    this.showOrderForm = true;
    this.orderSuccessMessage = '';
    this.orderErrorMessage = '';
  }

  closeOrderForm(): void {
    if (this.isCreatingOrder) {
      return;
    }

    this.showOrderForm = false;
  }

  createOrder(): void {
    if (!this.deal) {
      return;
    }

    this.orderSuccessMessage = '';
    this.orderErrorMessage = '';

    if (
      !this.shippingAddress.street.trim() ||
      !this.shippingAddress.city.trim() ||
      !this.shippingAddress.country.trim() ||
      !this.phone.trim()
    ) {
      this.orderErrorMessage = 'من فضلك أكمل بيانات الشحن ورقم الهاتف';
      return;
    }

    this.isCreatingOrder = true;

    this.orderService.createOrder(
      this.deal._id,
      {
        street: this.shippingAddress.street.trim(),
        city: this.shippingAddress.city.trim(),
        country: this.shippingAddress.country.trim()
      },
      this.phone.trim()
    ).subscribe({
      next: (response) => {
        this.isCreatingOrder = false;
        this.orderSuccessMessage = 'تم إنشاء الطلب بنجاح';

        setTimeout(() => {
          this.router.navigate(['/orders', response.data._id]);
        }, 1000);
      },
      error: (err) => {
        this.isCreatingOrder = false;

        this.orderErrorMessage =
          err?.error?.message ||
          'حدث خطأ أثناء إنشاء الطلب';
      }
    });
  }
}

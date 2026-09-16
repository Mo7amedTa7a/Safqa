import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BuyingRequest, BuyingRequestStatus } from '../models/buying-request.model';
import { BuyingRequestService } from '../services/buying-request.service';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-buying-request-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './buying-request-details.component.html',
  styleUrl: './buying-request-details.component.css'
})
export class BuyingRequestDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(BuyingRequestService);
  private readonly authService = inject(AuthService);

  request?: BuyingRequest & { offers?: any[] };
  loading = false;
  errorMessage = '';
  actionLoading = false;

  get currentUser() {
    return this.authService.currentUserValue;
  }

  get isSupplier(): boolean {
    return this.currentUser?.role === 'SUPPLIER';
  }

  get isOwner(): boolean {
    if (!this.request || !this.currentUser) return false;
    const buyerId = typeof this.request.buyer === 'string' ? this.request.buyer : (this.request.buyer as any)?._id;
    const currentUserId = (this.currentUser as any)?._id || (this.currentUser as any)?.id;
    return buyerId === currentUserId;
  }

  getOfferMetrics(offer: any) {
    const qty = this.request?.quantity || 1;
    const offerUnitPrice = offer.pricingTiers?.[0]?.unitPrice || 0;
    
    const originalUnitPrice = offer.originalUnitPrice && offer.originalUnitPrice > offerUnitPrice 
      ? offer.originalUnitPrice 
      : Math.round(offerUnitPrice * 1.25);

    const originalTotal = originalUnitPrice * qty;
    const offerTotal = offerUnitPrice * qty;
    const savings = originalTotal - offerTotal;
    const discountPercent = originalUnitPrice > 0 
      ? Math.round(((originalUnitPrice - offerUnitPrice) / originalUnitPrice) * 100) 
      : 0;

    return {
      moq: offer.moq || 1,
      offerUnitPrice,
      originalUnitPrice,
      originalTotal,
      offerTotal,
      savings,
      discountPercent
    };
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'معرّف الطلب غير موجود';
      return;
    }

    this.loading = true;

    this.service.getRequestById(id).subscribe({
      next: request => {
        this.request = request;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'تعذر تحميل الطلب';
      }
    });
  }

  productName(): string {
    if (!this.request) return '';
    return typeof this.request.product === 'string'
      ? this.request.product
      : this.request.product.name;
  }

  productDescription(): string {
    if (!this.request) return '';
    if (this.request.notes && this.request.notes.trim()) {
      return this.request.notes;
    }
    if (typeof this.request.product !== 'string' && this.request.product.description) {
      return this.request.product.description;
    }
    return 'لا توجد مواصفات إضافية';
  }

  variantText(): string {
    if (!this.request || typeof this.request.product === 'string') return this.request?.variant || '';

    const variant = this.request.product.variants.find(
      item => item._id === this.request?.variant
    );

    if (!variant) return this.request.variant;

    const attributesText = Object.entries(variant.attributes || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join(' • ');

    if (attributesText && !attributesText.includes('CUSTOM-')) {
      return attributesText;
    }

    return this.productDescription();
  }

  statusLabel(status: BuyingRequestStatus): string {
    const labels: Record<BuyingRequestStatus, string> = {
      OPEN: 'مفتوح',
      PENDING: 'قيد المراجعة',
      POOLED: 'ضمن تجمع',
      CLOSED: 'مغلق',
      CANCELLED: 'ملغى',
      FULFILLED: 'تم التنفيذ',
      COMPLETED: 'مكتمل'
    };

    return labels[status];
  }

  cancel(): void {
    if (!this.request || this.request.status !== 'OPEN') return;

    const confirmed = window.confirm('هل تريد إلغاء طلب الشراء؟');

    if (!confirmed) return;

    this.actionLoading = true;

    this.service.cancelRequest(this.request._id).subscribe({
      next: request => {
        this.request = request;
        this.actionLoading = false;
      },
      error: error => {
        this.actionLoading = false;
        this.errorMessage = error?.error?.message || 'تعذر إلغاء الطلب';
      }
    });
  }
}

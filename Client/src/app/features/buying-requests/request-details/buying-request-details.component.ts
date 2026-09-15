import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BuyingRequest, BuyingRequestStatus } from '../models/buying-request.model';
import { BuyingRequestService } from '../services/buying-request.service';

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

  request?: BuyingRequest;
  loading = false;
  errorMessage = '';
  actionLoading = false;

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

  variantText(): string {
    if (!this.request || typeof this.request.product === 'string') return this.request?.variant || '';

    const variant = this.request.product.variants.find(
      item => item._id === this.request?.variant
    );

    if (!variant) return this.request.variant;

    return Object.entries(variant.attributes || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join(' • ') || variant.sku;
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

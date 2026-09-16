import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BuyingRequest, BuyingRequestStatus } from '../models/buying-request.model';
import { BuyingRequestService } from '../services/buying-request.service';

@Component({
  selector: 'app-buying-request-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.css'
})
export class BuyingRequestListComponent implements OnInit {
  private readonly service = inject(BuyingRequestService);

  requests: BuyingRequest[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.errorMessage = '';

    this.service.getMyRequests().subscribe({
      next: requests => {
        this.requests = requests;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'تعذر تحميل طلباتك';
      }
    });
  }

  get filteredRequests(): BuyingRequest[] {
    return this.requests.filter(request => request.purchaseType === 'DIRECT');
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

  productName(request: BuyingRequest): string {
    return typeof request.product === 'string'
      ? request.product
      : request.product?.name || 'منتج';
  }

  productDetails(request: BuyingRequest): string {
    if (request.notes && request.notes.trim()) {
      return request.notes;
    }
    if (typeof request.product !== 'string' && request.product?.description) {
      return request.product.description;
    }
    return 'لا توجد مواصفات إضافية';
  }

  productImage(request: BuyingRequest): string {
    if (typeof request.product === 'string') return '';
    return request.product?.images?.[0] || '';
  }

  imageUrl(image: string): string {
    return image && image.startsWith('http') ? image : image ? `/${image}` : '';
  }

  canEdit(request: BuyingRequest): boolean {
    return request.status === 'OPEN';
  }

  getStatusBadgeClass(status: BuyingRequestStatus): string {
    switch (status) {
      case 'OPEN':
        return 'bg-success text-white';
      case 'PENDING':
        return 'bg-warning text-dark';
      case 'POOLED':
        return 'bg-info text-dark';
      case 'FULFILLED':
      case 'COMPLETED':
        return 'bg-primary text-white';
      case 'CLOSED':
      case 'CANCELLED':
        return 'bg-secondary text-white';
      default:
        return 'bg-light text-dark';
    }
  }
}

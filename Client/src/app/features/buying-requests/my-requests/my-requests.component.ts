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
  templateUrl: './buying-request-list.component.html',
  styleUrl: './buying-request-list.component.css'
})
export class BuyingRequestListComponent implements OnInit {
  private readonly service = inject(BuyingRequestService);

  requests: BuyingRequest[] = [];
  loading = false;
  errorMessage = '';
  selectedStatus: BuyingRequestStatus | '' = '';

  statuses: Array<BuyingRequestStatus | ''> = [
    '',
    'OPEN',
    'PENDING',
    'POOLED',
    'CLOSED',
    'CANCELLED',
    'FULFILLED',
    'COMPLETED'
  ];

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
    if (!this.selectedStatus) {
      return this.requests;
    }

    return this.requests.filter(request => request.status === this.selectedStatus);
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
}

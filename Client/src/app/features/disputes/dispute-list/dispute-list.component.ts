import { Component, OnInit } from '@angular/core';
import { DisputeService } from '../services/dispute.service';
import { Dispute } from '../models/dispute.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dispute-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dispute-list.component.html',
  styleUrls: ['./dispute-list.component.css']
})
export class DisputeListComponent implements OnInit {
  disputes: Dispute[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private disputeService: DisputeService) {}

  ngOnInit(): void {
    this.loadDisputes();
  }

  loadDisputes(): void {
    this.isLoading = true;
    this.disputeService.getDisputes().subscribe({
      next: (res) => {
        this.disputes = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل النزاعات';
        this.isLoading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'OPEN': return 'badge text-bg-warning';
      case 'UNDER_REVIEW': return 'badge text-bg-info';
      case 'APPROVED': return 'badge text-bg-success';
      case 'REJECTED': return 'badge text-bg-danger';
      case 'RESOLVED': return 'badge text-bg-secondary';
      default: return 'badge text-bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN': return 'مفتوح';
      case 'UNDER_REVIEW': return 'قيد المراجعة';
      case 'APPROVED': return 'تمت الموافقة';
      case 'REJECTED': return 'مرفوض';
      case 'RESOLVED': return 'تم الحل';
      default: return status;
    }
  }

  getReasonLabel(reason: string): string {
    switch (reason) {
      case 'DAMAGED': return 'منتج تالف';
      case 'WRONG_PRODUCT': return 'منتج خاطئ';
      case 'MISSING_ITEM': return 'منتج ناقص';
      case 'NOT_AS_DESCRIBED': return 'لا يطابق الوصف';
      case 'OTHER': return 'سبب آخر';
      default: return reason;
    }
  }
}

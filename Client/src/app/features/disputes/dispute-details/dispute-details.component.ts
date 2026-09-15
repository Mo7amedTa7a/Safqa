import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DisputeService } from '../services/dispute.service';
import { Dispute } from '../models/dispute.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dispute-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dispute-details.component.html',
  styleUrls: ['./dispute-details.component.css']
})
export class DisputeDetailsComponent implements OnInit {
  dispute: Dispute | null = null;
  isLoading = false;
  errorMessage = '';
  isUpdating = false;
  adminNote = '';

  constructor(
    private route: ActivatedRoute,
    private disputeService: DisputeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDisputeDetails(id);
    }
  }

  loadDisputeDetails(id: string): void {
    this.isLoading = true;
    this.disputeService.getDisputeById(id).subscribe({
      next: (res) => {
        this.dispute = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل تفاصيل النزاع';
        this.isLoading = false;
      }
    });
  }

  reviewDispute(newStatus: string): void {
    if (!this.dispute) return;
    this.isUpdating = true;
    this.disputeService.reviewDispute(this.dispute._id, { status: newStatus, adminNote: this.adminNote }).subscribe({
      next: (res) => {
        this.dispute = res.data;
        this.isUpdating = false;
      },
      error: (err) => {
        alert(err.error?.message || 'فشل تحديث حالة النزاع');
        this.isUpdating = false;
      }
    });
  }

  resolveDispute(): void {
    if (!this.dispute) return;
    this.isUpdating = true;
    this.disputeService.resolveDispute(this.dispute._id, { status: 'RESOLVED', adminNote: this.adminNote }).subscribe({
      next: (res) => {
        this.dispute = res.data;
        this.isUpdating = false;
      },
      error: (err) => {
        alert(err.error?.message || 'فشل حل النزاع');
        this.isUpdating = false;
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

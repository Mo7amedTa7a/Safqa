import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService, WithdrawalRequest } from '../services/wallet.service';

@Component({
  selector: 'app-admin-withdrawals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-withdrawals.component.html',
  styleUrls: ['./admin-withdrawals.component.css']
})
export class AdminWithdrawalsComponent implements OnInit {
  requests: WithdrawalRequest[] = [];
  isLoading = true;
  errorMessage = '';

  selectedRequest: WithdrawalRequest | null = null;
  adminNotes = '';
  isProcessing = false;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.walletService.getAllWithdrawalRequests().subscribe({
      next: (res) => {
        this.requests = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'تعذر تحميل طلبات السحب';
        this.isLoading = false;
      }
    });
  }

  openProcessModal(req: WithdrawalRequest): void {
    this.selectedRequest = req;
    this.adminNotes = '';
  }

  closeProcessModal(): void {
    this.selectedRequest = null;
  }

  processRequest(action: 'APPROVE' | 'REJECT'): void {
    if (!this.selectedRequest) return;
    
    if (action === 'REJECT' && !this.adminNotes) {
      alert('يجب كتابة سبب الرفض في الملاحظات');
      return;
    }

    if (action === 'APPROVE' && !confirm('هل أنت متأكد من تحويل المبلغ وتأكيد العملية؟')) {
      return;
    }

    this.isProcessing = true;
    this.walletService.processWithdrawal(this.selectedRequest._id, action, this.adminNotes).subscribe({
      next: () => {
        alert(action === 'APPROVE' ? 'تم تأكيد السحب' : 'تم رفض طلب السحب');
        this.isProcessing = false;
        this.closeProcessModal();
        this.loadRequests();
      },
      error: (err) => {
        alert(err.error?.message || 'حدث خطأ أثناء معالجة الطلب');
        this.isProcessing = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'badge text-bg-warning';
      case 'APPROVED': return 'badge text-bg-success';
      case 'REJECTED': return 'badge text-bg-danger';
      default: return 'badge text-bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'PENDING': return 'قيد المراجعة';
      case 'APPROVED': return 'تم التحويل';
      case 'REJECTED': return 'مرفوض';
      default: return status;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService, Wallet, Transaction } from '../services/wallet.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-wallet-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-dashboard.component.html',
  styleUrls: ['./wallet-dashboard.component.css']
})
export class WalletDashboardComponent implements OnInit {
  wallet: Wallet | null = null;
  transactions: Transaction[] = [];
  
  isLoading = true;
  errorMessage = '';
  
  showWithdrawModal = false;
  withdrawAmount = 0;
  bankDetails = {
    bankName: '',
    accountNumber: '',
    accountName: ''
  };
  isSubmitting = false;

  constructor(
    private walletService: WalletService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.walletService.getMyWallet().subscribe({
      next: (res) => {
        this.wallet = res.data;
        this.loadTransactions();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'تعذر تحميل المحفظة';
        this.isLoading = false;
      }
    });
  }

  loadTransactions(): void {
    this.walletService.getMyTransactions().subscribe({
      next: (res) => {
        this.transactions = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openWithdrawModal(): void {
    this.showWithdrawModal = true;
    this.withdrawAmount = 0;
  }

  closeWithdrawModal(): void {
    this.showWithdrawModal = false;
  }

  submitWithdrawal(): void {
    if (this.withdrawAmount <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }
    
    if (this.wallet && this.withdrawAmount > this.wallet.balance) {
      alert('الرصيد غير كافٍ');
      return;
    }

    this.isSubmitting = true;
    this.walletService.requestWithdrawal(this.withdrawAmount, this.bankDetails).subscribe({
      next: () => {
        alert('تم تقديم طلب السحب بنجاح');
        this.isSubmitting = false;
        this.closeWithdrawModal();
        this.loadData(); // reload wallet to update balances
      },
      error: (err) => {
        alert(err.error?.message || 'حدث خطأ أثناء السحب');
        this.isSubmitting = false;
      }
    });
  }
}

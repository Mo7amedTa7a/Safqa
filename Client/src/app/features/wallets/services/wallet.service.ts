import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Wallet {
  _id: string;
  user: string;
  balance: number;
  pendingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  wallet: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  referenceOrder?: any;
  status: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  _id: string;
  user: any;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  adminNotes?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallets`;

  constructor(private http: HttpClient) {}

  getMyWallet(): Observable<{ status: string; data: Wallet }> {
    return this.http.get<{ status: string; data: Wallet }>(`${this.apiUrl}/my-wallet`);
  }

  getMyTransactions(): Observable<{ status: string; data: Transaction[] }> {
    return this.http.get<{ status: string; data: Transaction[] }>(`${this.apiUrl}/my-transactions`);
  }

  requestWithdrawal(amount: number, bankDetails: any): Observable<{ status: string; data: WithdrawalRequest }> {
    return this.http.post<{ status: string; data: WithdrawalRequest }>(`${this.apiUrl}/withdraw`, { amount, bankDetails });
  }

  getAllWithdrawalRequests(): Observable<{ status: string; data: WithdrawalRequest[] }> {
    return this.http.get<{ status: string; data: WithdrawalRequest[] }>(`${this.apiUrl}/withdrawals`);
  }

  processWithdrawal(id: string, action: 'APPROVE' | 'REJECT', adminNotes: string): Observable<{ status: string; data: WithdrawalRequest }> {
    return this.http.patch<{ status: string; data: WithdrawalRequest }>(`${this.apiUrl}/withdrawals/${id}/process`, { action, adminNotes });
  }
}

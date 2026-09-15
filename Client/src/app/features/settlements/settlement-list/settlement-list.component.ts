import { Component, OnInit } from '@angular/core';
import { SettlementService } from '../services/settlement.service';
import { Settlement } from '../models/settlement.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settlement-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './settlement-list.component.html',
  styleUrls: ['./settlement-list.component.css']
})
export class SettlementListComponent implements OnInit {
  settlements: Settlement[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private settlementService: SettlementService) {}

  ngOnInit(): void {
    this.loadSettlements();
  }

  loadSettlements(): void {
    this.isLoading = true;
    this.settlementService.getSettlements().subscribe({
      next: (res) => {
        this.settlements = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل التسويات';
        this.isLoading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge text-bg-warning';
      case 'HELD': return 'badge text-bg-danger';
      case 'RELEASED': return 'badge text-bg-success';
      case 'CANCELLED': return 'badge text-bg-secondary';
      default: return 'badge text-bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'قيد الانتظار';
      case 'HELD': return 'معلقة';
      case 'RELEASED': return 'تم التحويل للمورد';
      case 'CANCELLED': return 'ملغاة';
      default: return status;
    }
  }
}

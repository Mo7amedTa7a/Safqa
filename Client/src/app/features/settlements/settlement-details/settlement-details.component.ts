import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SettlementService } from '../services/settlement.service';
import { Settlement } from '../models/settlement.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settlement-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './settlement-details.component.html',
  styleUrls: ['./settlement-details.component.css']
})
export class SettlementDetailsComponent implements OnInit {
  settlement: Settlement | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private settlementService: SettlementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSettlementDetails(id);
    }
  }

  loadSettlementDetails(id: string): void {
    this.isLoading = true;
    this.settlementService.getSettlementById(id).subscribe({
      next: (res) => {
        this.settlement = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل تفاصيل التسوية';
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

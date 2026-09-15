import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-settlements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-settlements.component.html',
  styleUrl: './admin-settlements.component.css'
})
export class AdminSettlementsComponent implements OnInit {
  settlements: any[] = [];
  isLoading = false;
  errorMessage = '';

  totalCommissions = 0;
  totalHeld = 0;
  totalReleased = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSettlements();
  }

  loadSettlements(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.getSettlements().subscribe({
      next: (res) => {
        this.settlements = res.data;
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل بيانات التسويات.';
        this.isLoading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalCommissions = this.settlements.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
    this.totalHeld = this.settlements
      .filter(s => s.status === 'HELD')
      .reduce((sum, s) => sum + (s.supplierAmount || 0), 0);
    this.totalReleased = this.settlements
      .filter(s => s.status === 'RELEASED')
      .reduce((sum, s) => sum + (s.supplierAmount || 0), 0);
  }

  holdSettlement(id: string): void {
    if (confirm('هل أنت متأكد من رغبتك في تجميد هذه التسوية؟')) {
      this.adminService.holdSettlement(id).subscribe({
        next: () => this.loadSettlements(),
        error: (err) => alert(err.error?.message || 'حدث خطأ أثناء تجميد التسوية')
      });
    }
  }

  releaseSettlement(id: string): void {
    if (confirm('هل أنت متأكد من رغبتك في الإفراج عن هذه التسوية؟ (سيتم إرسال المبلغ للمورد)')) {
      this.adminService.releaseSettlement(id).subscribe({
        next: () => this.loadSettlements(),
        error: (err) => alert(err.error?.message || 'حدث خطأ أثناء الإفراج عن التسوية')
      });
    }
  }
}

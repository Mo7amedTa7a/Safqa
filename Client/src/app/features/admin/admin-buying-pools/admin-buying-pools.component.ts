import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { BuyingPoolService } from '../../buying-pools/services/buying-pool.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-buying-pools',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-buying-pools.component.html',
  styleUrl: './admin-buying-pools.component.css'
})
export class AdminBuyingPoolsComponent implements OnInit {
  pools: any[] = [];
  isLoading = false;
  errorMessage = '';
  isEndingPoolId: string | null = null;
  isAwardingPoolId: string | null = null;

  constructor(
    private adminService: AdminService,
    private poolService: BuyingPoolService
  ) {}

  ngOnInit(): void {
    this.loadPools();
  }

  loadPools(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.getBuyingPools().subscribe({
      next: (res) => {
        this.pools = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل التجمعات الشرائية.';
        this.isLoading = false;
      }
    });
  }

  endPool(pool: any): void {
    const confirmMessage = pool.status === 'OPEN' 
      ? 'هل أنت متأكد من إغلاق هذا التجمع لانتقال لمرحلة تلقي العروض؟'
      : 'هل أنت متأكد من إنهاء مرحلة تلقي العروض وإغلاق التجمع نهائياً بدون ترسية؟';

    if (confirm(confirmMessage)) {
      this.isEndingPoolId = pool._id;
      this.poolService.closePool(pool._id).subscribe({
        next: (res) => {
          alert(pool.status === 'OPEN' ? 'تم إغلاق التجمع لتلقي العروض بنجاح.' : 'تم إغلاق التجمع نهائياً.');
          this.isEndingPoolId = null;
          this.loadPools(); // Reload to get updated status
        },
        error: (err) => {
          alert(err.error?.message || 'حدث خطأ أثناء الإغلاق.');
          this.isEndingPoolId = null;
        }
      });
    }
  }

  awardDeal(poolId: string): void {
    if (confirm('هل أنت متأكد من ترسية العطاء وإنشاء صفقة لهذا التجمع؟')) {
      this.isAwardingPoolId = poolId;
      this.poolService.selectOffer(poolId).subscribe({
        next: (res) => {
          alert('تم ترسية العطاء وإنشاء الصفقة بنجاح.');
          this.isAwardingPoolId = null;
          this.loadPools(); // Reload to get updated status
        },
        error: (err) => {
          alert(err.error?.message || 'حدث خطأ أثناء ترسية العطاء.');
          this.isAwardingPoolId = null;
        }
      });
    }
  }
}

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

  endPool(poolId: string): void {
    if (confirm('هل أنت متأكد من إنهاء هذا التجمع الشرائي واختيار أفضل عرض الآن؟')) {
      this.isEndingPoolId = poolId;
      this.poolService.closePool(poolId).subscribe({
        next: (res) => {
          alert('تم إنهاء التجمع وإنشاء الصفقة بنجاح.');
          this.isEndingPoolId = null;
          this.loadPools(); // Reload to get updated status
        },
        error: (err) => {
          alert(err.error?.message || 'حدث خطأ أثناء إنهاء التجمع.');
          this.isEndingPoolId = null;
        }
      });
    }
  }
}

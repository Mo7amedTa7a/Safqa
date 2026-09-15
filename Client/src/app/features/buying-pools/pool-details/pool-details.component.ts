// Member 3 - Pool Details
// GET /api/buying-pools/:id
// بيانات المنتج، الكمية، الأعضاء، countdown للـ closeAt
// قائمة PoolMembers + Supplier Offers
// BUYER: Join | Update Qty | Leave
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BuyingPoolService } from '../services/buying-pool.service';
import { BuyingPool } from '../models/buying-pool.model';

@Component({
  selector: 'app-pool-details',
  imports: [],
  templateUrl: './pool-details.component.html',
  styleUrl: './pool-details.component.css'
})
export class PoolDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private buyingPoolService = inject(BuyingPoolService);

  poolId = '';
  pool: BuyingPool | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.poolId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.poolId) {
      this.errorMessage = 'رقم الـ Pool غير موجود';
      return;
    }

    this.loadPool();
  }

  loadPool(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.buyingPoolService.getBuyingPoolById(this.poolId).subscribe({
      next: (response) => {
        console.log('Pool Details:', response);

        this.pool = response.data;

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Error loading pool:', error);

        this.errorMessage = 'حدث خطأ أثناء تحميل تفاصيل الـ Pool';

        this.isLoading = false;
      }
    });
  }
}
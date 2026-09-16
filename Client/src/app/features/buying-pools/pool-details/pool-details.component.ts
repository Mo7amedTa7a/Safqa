// Member 3 - Pool Details
// GET /api/buying-pools/:id
// BUYER: Join | Update Qty | Leave

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BuyingPoolService } from '../services/buying-pool.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  BuyingPool,
  UpdateQuantityRequest
} from '../models/buying-pool.model';

@Component({
  selector: 'app-pool-details',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './pool-details.component.html',
  styleUrl: './pool-details.component.css'
})
export class PoolDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private buyingPoolService = inject(BuyingPoolService);
  private authService = inject(AuthService);

  poolId = '';
  pool: BuyingPool | null = null;

  get currentUser() {
    return this.authService.currentUserValue;
  }

  getOfferMetrics(offer: any) {
    const moq = offer.moq || offer.pricingTiers?.[0]?.minQty || 1;
    const offerUnitPrice = offer.pricingTiers?.[0]?.unitPrice || 0;
    
    const originalUnitPrice = offer.originalUnitPrice && offer.originalUnitPrice > offerUnitPrice 
      ? offer.originalUnitPrice 
      : Math.round(offerUnitPrice * 1.25);

    const originalTotal = originalUnitPrice * moq;
    const offerTotal = offerUnitPrice * moq;
    const savings = originalTotal - offerTotal;
    const discountPercent = originalUnitPrice > 0 
      ? Math.round(((originalUnitPrice - offerUnitPrice) / originalUnitPrice) * 100) 
      : 0;

    return {
      moq,
      offerUnitPrice,
      originalUnitPrice,
      originalTotal,
      offerTotal,
      savings,
      discountPercent
    };
  }

  isLoading = false;
  errorMessage = '';

  quantity = 1;
  isUpdatingQuantity = false;
  updateMessage = '';
  isLeavingPool = false;
leaveMessage = '';

////////////////////////
  ngOnInit(): void {
    this.poolId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.poolId) {
      this.errorMessage = 'رقم الـ Pool غير موجود';
      return;
    }

    this.loadPool();
  }
////////////////////////////////////
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
  //////////////////////////////////////////////////////

  updateQuantity(): void {
    if (!this.poolId) {
      return;
    }

    if (this.quantity < 1) {
      this.updateMessage = 'الكمية يجب أن تكون أكبر من صفر';
      return;
    }

    const data: UpdateQuantityRequest = {
      quantity: this.quantity
    };

    this.isUpdatingQuantity = true;
    this.updateMessage = '';

    this.buyingPoolService.updateQuantity(this.poolId, data).subscribe({
      next: (response) => {
        console.log('Quantity Updated:', response);

        this.pool = response.data.pool;
        this.quantity = response.data.member.quantity;

        this.updateMessage = 'تم تحديث الكمية بنجاح';
        this.isUpdatingQuantity = false;
      },

      error: (error) => {
        console.error('Error updating quantity:', error);

        this.updateMessage =
          error?.error?.message || 'حدث خطأ أثناء تحديث الكمية';

        this.isUpdatingQuantity = false;
      }

      
    });
  }
  /////////////////////////////
  leavePool(): void {
  if (!this.poolId) {
    return;
  }

  this.isLeavingPool = true;
  this.leaveMessage = '';

  this.buyingPoolService.leavePool(this.poolId).subscribe({
    next: (response) => {
      console.log('Left Pool:', response);

      this.pool = response.data.pool;

      this.leaveMessage = 'تم مغادرة التجمع بنجاح';
      this.isLeavingPool = false;
    },

    error: (error) => {
      console.error('Error leaving pool:', error);

      this.leaveMessage =
        error?.error?.message || 'حدث خطأ أثناء مغادرة التجمع';

      this.isLeavingPool = false;
    }
  });
}
}
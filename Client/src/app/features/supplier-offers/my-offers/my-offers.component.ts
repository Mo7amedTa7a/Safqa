import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SupplierOfferService } from '../services/supplier-offer.service';
import { SupplierOffer } from '../models/supplier-offer.model';

@Component({
  selector: 'app-my-offers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-offers.component.html',
  styleUrl: './my-offers.component.css'
})
export class MyOffersComponent implements OnInit {

  private supplierOfferService = inject(SupplierOfferService);

  offers: SupplierOffer[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Withdraw Modal State
  selectedOfferToWithdraw: SupplierOffer | null = null;
  isWithdrawing = false;

  ngOnInit(): void {
    this.getMyOffers();
  }

  getMyOffers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.supplierOfferService
      .getMyOffers()
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.offers = response.data || [];
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error?.error?.message ||
            'حدث خطأ أثناء تحميل عروضك';
        }
      });
  }

  openWithdrawModal(offer: SupplierOffer): void {
    this.selectedOfferToWithdraw = offer;
  }

  closeWithdrawModal(): void {
    this.selectedOfferToWithdraw = null;
  }

  confirmWithdraw(): void {
    if (!this.selectedOfferToWithdraw) return;

    this.isWithdrawing = true;
    const offerId = this.selectedOfferToWithdraw._id;

    this.supplierOfferService.withdrawOffer(offerId).subscribe({
      next: () => {
        this.isWithdrawing = false;
        this.selectedOfferToWithdraw = null;
        this.successMessage = 'تم سحب العرض بنجاح';
        setTimeout(() => this.successMessage = '', 4000);
        this.getMyOffers();
      },
      error: (err) => {
        this.isWithdrawing = false;
        this.errorMessage = err?.error?.message || 'تعذر سحب العرض حالياً';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ELIGIBLE':
        return 'badge-eligible';
      case 'SELECTED':
        return 'badge-selected';
      case 'PENDING':
        return 'badge-pending';
      case 'WITHDRAWN':
        return 'badge-withdrawn';
      case 'INELIGIBLE':
        return 'badge-ineligible';
      default:
        return 'badge-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ELIGIBLE':
        return 'مؤهل للتنافس';
      case 'SELECTED':
        return 'تم الاختيار والقبول';
      case 'PENDING':
        return 'قيد المراجعة والتدقيق';
      case 'WITHDRAWN':
        return 'عطاء مسحوب';
      case 'INELIGIBLE':
        return 'غير مؤهل';
      default:
        return status;
    }
  }
}
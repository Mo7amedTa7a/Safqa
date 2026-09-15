// Member 3 - Offer Details
//
// GET /api/supplier-offers/:id
//
// يعرض:
// - MOQ
// - pricingTiers
// - deliveryDays
// - warranty
// - terms
// - status

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SupplierOfferService } from '../services/supplier-offer.service';
import { SupplierOffer } from '../models/supplier-offer.model';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.css',
})
export class OfferDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supplierOfferService = inject(SupplierOfferService);

  offerId = '';
  offer: SupplierOffer | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    // Get the real offer id from URL
    this.offerId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.offerId) {
      this.errorMessage = 'معرف العرض غير موجود';

      return;
    }

    this.getOfferDetails();
  }


  getOfferDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.supplierOfferService.getOfferById(this.offerId).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.offer = response.data;
        }
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error?.error?.message || 'حدث خطأ أثناء تحميل تفاصيل العرض';
      },
    });
  }
}

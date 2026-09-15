// Member 3 - My Offers
// GET /api/supplier-offers/my
// Status: ACTIVE|WITHDRAWN|SELECTED|REJECTED
// Actions: View | Edit (ACTIVE) | Withdraw (ACTIVE)
// Member 3 - My Offers
//
// GET /api/supplier-offers/my
//
// Status:
// ACTIVE | WITHDRAWN | SELECTED | REJECTED
//
// Actions:
// View
// Edit       → ACTIVE فقط
// Withdraw   → ACTIVE فقط

import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SupplierOfferService } from '../services/supplier-offer.service';
import { SupplierOffer } from '../models/supplier-offer.model';

@Component({
  selector: 'app-my-offers',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-offers.component.html',
  styleUrl: './my-offers.component.css'
})
export class MyOffersComponent implements OnInit {

  private supplierOfferService = inject(SupplierOfferService);

  offers: SupplierOffer[] = [];

  isLoading = false;
  errorMessage = '';

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
            this.offers = response.data;
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

}
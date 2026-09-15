import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SupplierOfferService } from '../services/supplier-offer.service';
import { CreateSupplierOfferRequest } from '../models/supplier-offer.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-offer',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-offer.component.html',
  styleUrl: './edit-offer.component.css',
})
export class EditOfferComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supplierOfferService = inject(SupplierOfferService);

  offerId = '';

  isLoading = false;
  isLoadingOffer = false;

  successMessage = '';
  errorMessage = '';

  offerForm = new FormGroup({
    moq: new FormControl(1, [Validators.required, Validators.min(1)]),

    pricingTiers: new FormArray([this.createPricingTier()]),

    deliveryDays: new FormControl(1, [Validators.required, Validators.min(1)]),

    warranty: new FormControl('', [Validators.required]),

    terms: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.offerId) {
      this.errorMessage = 'معرف العرض غير موجود';

      return;
    }

    this.getOfferDetails();
  }

  // Get existing offer
  getOfferDetails(): void {
    this.isLoadingOffer = true;
    this.errorMessage = '';

    this.supplierOfferService.getOfferById(this.offerId).subscribe({
      next: (response) => {
        this.isLoadingOffer = false;

        if (!response.success) {
          this.errorMessage = 'تعذر تحميل بيانات العرض';

          return;
        }

        const offer = response.data;

        // Fill normal fields
        this.offerForm.patchValue({
          moq: offer.moq,
          deliveryDays: offer.deliveryDays,
          warranty: offer.warranty,
          terms: offer.terms,
        });

        // Clear current pricing tiers
        this.pricingTiers.clear();

        // Add existing pricing tiers
        offer.pricingTiers.forEach((tier) => {
          this.pricingTiers.push(
            new FormGroup({
              minQty: new FormControl(tier.minQty, [
                Validators.required,
                Validators.min(1),
              ]),

              unitPrice: new FormControl(tier.unitPrice, [
                Validators.required,
                Validators.min(0),
              ]),
            }),
          );
        });
      },

      error: (error) => {
        this.isLoadingOffer = false;

        this.errorMessage =
          error?.error?.message || 'حدث خطأ أثناء تحميل بيانات العرض';
      },
    });
  }

  // Create Pricing Tier
  createPricingTier(): FormGroup {
    return new FormGroup({
      minQty: new FormControl(1, [Validators.required, Validators.min(1)]),

      unitPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    });
  }

  // Get Pricing Tiers
  get pricingTiers(): FormArray {
    return this.offerForm.get('pricingTiers') as FormArray;
  }

  // Add Pricing Tier
  addPricingTier(): void {
    this.pricingTiers.push(this.createPricingTier());
  }

  // Remove Pricing Tier
  removePricingTier(index: number): void {
    if (this.pricingTiers.length > 1) {
      this.pricingTiers.removeAt(index);
    }
  }

  // Update Offer
  updateOffer(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.offerId) {
      this.errorMessage = 'معرف العرض غير موجود';

      return;
    }

    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();

      this.errorMessage = 'من فضلك أدخل جميع البيانات بشكل صحيح';

      return;
    }

    const data = this.offerForm.getRawValue() as CreateSupplierOfferRequest;

    this.isLoading = true;

    this.supplierOfferService.updateOffer(this.offerId, data).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.successMessage = 'تم تعديل العرض بنجاح';

          setTimeout(() => {
            this.router.navigate(['/supplier/my-offers']);
          }, 1000);
        }
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error?.error?.message || 'حدث خطأ أثناء تعديل العرض';
      },
    });
  }
}

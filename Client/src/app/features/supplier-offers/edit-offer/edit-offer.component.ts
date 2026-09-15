// Member 3 - Edit Offer
// PATCH /api/supplier-offers/:id
// فقط لو status = ACTIVE
// Fields: unitPrice, deliveryDays, warranty, terms, pricingTiers
// Member 3 - Edit Offer
//
// PATCH /api/supplier-offers/:id
//
// الهدف:
// تعديل بيانات الـ Supplier Offer
//
// ملاحظة:
// الـ Backend الحالي لا يحتوي على GET /api/supplier-offers/:id
// لذلك الـ Form هنا جاهز للتعديل والإرسال،
// وسيتم تحميل القيم القديمة لاحقًا من My Offers / Offer Details.

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { SupplierOfferService } from '../services/supplier-offer.service';
import { CreateSupplierOfferRequest } from '../models/supplier-offer.model';

@Component({
  selector: 'app-edit-offer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-offer.component.html',
  styleUrl: './edit-offer.component.css'
})
export class EditOfferComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supplierOfferService = inject(SupplierOfferService);

  offerId = '';

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  

  offerForm = new FormGroup({

    pricingTiers: new FormArray([
      this.createPricingTier()
    ]),

    deliveryDays: new FormControl(1, [
      Validators.required,
      Validators.min(1)
    ]),

    warranty: new FormControl('', [
      Validators.required
    ]),

    terms: new FormControl('', [
      Validators.required
    ])

  });


  // Get Offer ID From URL

  ngOnInit(): void {

    this.offerId =
      this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.offerId) {

      this.errorMessage =
        'معرف العرض غير موجود';

    }

  }


  // Create Pricing Tier

  createPricingTier(): FormGroup {

    return new FormGroup({

      minQty: new FormControl(1, [
        Validators.required,
        Validators.min(1)
      ]),

      unitPrice: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ])

    });

  }


  // Get Pricing Tiers FormArray

  get pricingTiers(): FormArray {

    return this.offerForm.get(
      'pricingTiers'
    ) as FormArray;

  }


  // Add Pricing Tier

  addPricingTier(): void {

    this.pricingTiers.push(
      this.createPricingTier()
    );

  }


  // Remove Pricing Tier

  removePricingTier(index: number): void {

    if (this.pricingTiers.length > 1) {

      this.pricingTiers.removeAt(index);

    }

  }


  // Submit Update
  // PATCH /api/supplier-offers/:id

  updateOffer(): void {

    this.successMessage = '';
    this.errorMessage = '';

    // Check Offer ID
    if (!this.offerId) {

      this.errorMessage =
        'معرف العرض غير موجود';

      return;

    }


    // Check Form Validation
    if (this.offerForm.invalid) {

      this.offerForm.markAllAsTouched();

      this.errorMessage =
        'من فضلك أدخل جميع البيانات بشكل صحيح';

      return;

    }


    // Get Form Data
    const data =
      this.offerForm.getRawValue() as Partial<CreateSupplierOfferRequest>;


    this.isLoading = true;


    // Call Backend
    this.supplierOfferService
      .updateOffer(this.offerId, data)
      .subscribe({

        // Success
        next: (response) => {

          this.isLoading = false;

          if (response.success) {

            this.successMessage =
              'تم تعديل العرض بنجاح';

            setTimeout(() => {

              this.router.navigate([
                '/supplier/my-offers'
              ]);

            }, 1000);

          }

        },


        // Error
        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'حدث خطأ أثناء تعديل العرض';

        }

      });

  }

}
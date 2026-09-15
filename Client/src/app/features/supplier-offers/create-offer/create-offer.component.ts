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
  selector: 'app-create-offer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.css'
})
export class CreateOfferComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supplierOfferService = inject(SupplierOfferService);

  poolId = '';

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  offerForm = new FormGroup({

    moq: new FormControl(1, [
      Validators.required,
      Validators.min(1)
    ]),

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


  ngOnInit(): void {

    this.poolId =
      this.route.snapshot.paramMap.get('id') ?? '';

  }


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


  get pricingTiers(): FormArray {

    return this.offerForm.get('pricingTiers') as FormArray;

  }


  addPricingTier(): void {

    this.pricingTiers.push(
      this.createPricingTier()
    );

  }


  removePricingTier(index: number): void {

    if (this.pricingTiers.length > 1) {

      this.pricingTiers.removeAt(index);

    }

  }


  submitOffer(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (!this.poolId) {

      this.errorMessage =
        'رقم التجمع غير موجود';

      return;

    }


    if (this.offerForm.invalid) {

      this.offerForm.markAllAsTouched();

      this.errorMessage =
        'من فضلك أدخل جميع البيانات بشكل صحيح';

      return;

    }


    const data =
      this.offerForm.getRawValue() as CreateSupplierOfferRequest;


    this.isLoading = true;


    this.supplierOfferService
      .createOffer(this.poolId, data)
      .subscribe({

        next: (response) => {

          this.isLoading = false;

          if (response.success) {

            this.successMessage =
              'تم إرسال العرض بنجاح';

            setTimeout(() => {

              this.router.navigate([
                '/buying-pools',
                this.poolId
              ]);

            }, 1000);

          }

        },

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'حدث خطأ أثناء إرسال العرض';

        }

      });

  }

}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PurchaseType } from '../models/buying-request.model';
import { BuyingRequestService } from '../services/buying-request.service';

@Component({
  selector: 'app-buying-request-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './buying-request-create.component.html',
  styleUrl: './buying-request-create.component.css'
})
export class BuyingRequestCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly buyingRequestService = inject(BuyingRequestService);

  submitting = false;
  errorMessage = '';

  categories: string[] = [
    'مواد غذائية وزيوت',
    'حديد ومواد بناء',
    'أجهزة وإلكترونيات',
    'مستلزمات ومواد خام مصانع',
    'أوراق وتغليف',
    'قطع غيار ومعدات',
    'عام / أخرى'
  ];

  form = this.fb.nonNullable.group({
    purchaseType: ['GROUP' as PurchaseType, Validators.required],
    productName: ['', [Validators.required, Validators.minLength(2)]],
    category: ['مواد غذائية وزيوت', Validators.required],
    specifications: ['', [Validators.required, Validators.minLength(5)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    location: ['']
  });

  ngOnInit(): void {
    const purchaseType = this.route.snapshot.queryParamMap.get('purchaseType') as PurchaseType | null;
    if (purchaseType === 'GROUP' || purchaseType === 'DIRECT') {
      this.form.controls.purchaseType.setValue(purchaseType);
    }

    this.onPurchaseTypeChange();

    this.form.controls.purchaseType.valueChanges.subscribe(() => {
      this.onPurchaseTypeChange();
    });
  }

  onPurchaseTypeChange(): void {
    const isDirect = this.form.controls.purchaseType.value === 'DIRECT';
    if (isDirect) {
      this.form.controls.location.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      this.form.controls.location.clearValidators();
    }
    this.form.controls.location.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const payload = this.form.getRawValue();

    this.buyingRequestService.createRequest(payload).subscribe({
      next: request => {
        this.submitting = false;
        if (this.form.controls.purchaseType.value === 'GROUP') {
          this.router.navigate(['/buying-pools']);
        } else {
          this.router.navigate(['/buying-requests']);
        }
      },
      error: error => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'تعذر إنشاء عملية الشراء';
      }
    });
  }
}

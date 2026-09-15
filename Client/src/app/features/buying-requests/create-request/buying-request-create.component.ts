import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../products/models/product.model';
import { PurchaseType } from '../models/buying-request.model';
import { ProductService } from '../../products/services/product.service';
import { BuyingRequestService } from '../services/buying-request.service';

@Component({
  selector: 'app-buying-request-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './buying-request-create.component.html',
  styleUrl: './buying-request-create.component.css'
})
export class BuyingRequestCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly buyingRequestService = inject(BuyingRequestService);

  product?: Product;
  loading = false;
  submitting = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    product: ['', Validators.required],
    variant: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    location: ['', [Validators.required, Validators.minLength(2)]],
    purchaseType: ['DIRECT' as PurchaseType, Validators.required]
  });

  ngOnInit(): void {
    const productId = this.route.snapshot.queryParamMap.get('product');
    const variantId = this.route.snapshot.queryParamMap.get('variant');
    const purchaseType = this.route.snapshot.queryParamMap.get('purchaseType') as PurchaseType | null;

    if (!productId) {
      this.errorMessage = 'اختر منتجًا أولًا';
      return;
    }

    if (purchaseType === 'GROUP' || purchaseType === 'DIRECT') {
      this.form.controls.purchaseType.setValue(purchaseType);
    }

    this.loading = true;

    this.productService.getProductById(productId).subscribe({
      next: product => {
        this.product = product;
        this.form.controls.product.setValue(product._id);

        const selected = product.variants.find(variant => variant._id === variantId)
          || product.variants[0];

        if (selected) {
          this.form.controls.variant.setValue(selected._id);
        }

        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'تعذر تحميل المنتج';
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.buyingRequestService.createRequest(this.form.getRawValue()).subscribe({
      next: request => {
        this.submitting = false;

        // GROUP requests are later consumed by the pool feature.
        this.router.navigate(['/buying-requests', request._id]);
      },
      error: error => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'تعذر إنشاء الطلب';
      }
    });
  }
}

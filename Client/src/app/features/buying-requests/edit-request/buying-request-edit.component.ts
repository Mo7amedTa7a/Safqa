import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BuyingRequestService } from '../services/buying-request.service';
import { BuyingRequest } from '../models/buying-request.model';

@Component({
  selector: 'app-buying-request-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './buying-request-edit.component.html',
  styleUrl: './buying-request-edit.component.css'
})
export class BuyingRequestEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(BuyingRequestService);

  request?: BuyingRequest;
  loading = false;
  submitting = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
    location: ['', [Validators.required, Validators.minLength(2)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'معرّف الطلب غير موجود';
      return;
    }

    this.loading = true;

    this.service.getRequestById(id).subscribe({
      next: request => {
        this.request = request;

        if (request.status !== 'OPEN') {
          this.errorMessage = 'لا يمكن تعديل الطلب إلا إذا كانت حالته OPEN.';
          this.loading = false;
          return;
        }

        this.form.patchValue({
          quantity: request.quantity,
          location: request.location
        });

        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'تعذر تحميل الطلب';
      }
    });
  }

  productName(): string {
    if (!this.request) return '';
    return typeof this.request.product === 'string'
      ? this.request.product
      : this.request.product.name;
  }

  submit(): void {
    if (!this.request || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.service.updateRequest(this.request._id, this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/buying-requests', this.request?._id]);
      },
      error: error => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'تعذر تحديث الطلب';
      }
    });
  }
}

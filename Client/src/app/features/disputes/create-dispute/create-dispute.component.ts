import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DisputeService } from '../services/dispute.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-dispute',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-dispute.component.html',
  styleUrls: ['./create-dispute.component.css']
})
export class CreateDisputeComponent {
  orderId = '';
  reason = '';
  description = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  reasonOptions = [
    { value: 'DAMAGED', label: 'منتج تالف' },
    { value: 'WRONG_PRODUCT', label: 'منتج خاطئ' },
    { value: 'MISSING_ITEM', label: 'منتج ناقص' },
    { value: 'NOT_AS_DESCRIBED', label: 'لا يطابق الوصف' },
    { value: 'OTHER', label: 'سبب آخر' }
  ];

  constructor(
    private disputeService: DisputeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
  }

  submitDispute(): void {
    if (!this.orderId || !this.reason || !this.description) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.disputeService.createDispute(this.orderId, {
      reason: this.reason,
      description: this.description
    }).subscribe({
      next: (res) => {
        this.successMessage = 'تم تقديم النزاع بنجاح';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/disputes']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تقديم النزاع';
        this.isSubmitting = false;
      }
    });
  }
}

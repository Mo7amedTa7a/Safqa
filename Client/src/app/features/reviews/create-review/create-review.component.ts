import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ReviewService } from '../services/review.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css']
})
export class CreateReviewComponent {
  orderId = '';
  reviewedUser = '';
  rating = 0;
  comment = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  hoverRating = 0;

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
    this.reviewedUser = this.route.snapshot.queryParamMap.get('reviewedUser') || '';
  }

  setRating(value: number): void {
    this.rating = value;
  }

  submitReview(): void {
    if (!this.orderId || !this.reviewedUser || this.rating === 0) {
      this.errorMessage = 'يرجى اختيار التقييم وملء جميع الحقول المطلوبة';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.reviewService.createReview(this.orderId, {
      reviewedUser: this.reviewedUser,
      rating: this.rating,
      comment: this.comment || undefined
    }).subscribe({
      next: () => {
        this.successMessage = 'تم إرسال التقييم بنجاح';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/orders']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء إرسال التقييم';
        this.isSubmitting = false;
      }
    });
  }
}

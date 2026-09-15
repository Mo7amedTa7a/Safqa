import { Component, OnInit, Input } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input() userId = '';
  reviews: Review[] = [];
  isLoading = false;
  errorMessage = '';
  averageRating = 0;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getReviewsByUser(this.userId).subscribe({
      next: (res) => {
        this.reviews = res.data;
        this.calculateAverage();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل التقييمات';
        this.isLoading = false;
      }
    });
  }

  calculateAverage(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}

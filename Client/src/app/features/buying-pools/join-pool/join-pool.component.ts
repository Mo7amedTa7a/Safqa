// Member 3 - Join Pool
// POST /api/buying-pools/:poolId/members
// BUYER يختار buyingRequestId + quantity
// بيعرض تفاصيل الـ pool قبل التأكيد
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyingPoolService } from '../services/buying-pool.service';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [],
  templateUrl: './join-pool.component.html',
  styleUrl: './join-pool.component.css'
})
export class JoinComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private buyingPoolService = inject(BuyingPoolService);

  poolId = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.poolId = this.route.snapshot.paramMap.get('id') || '';
  }

  joinPool(): void {

    if (!this.poolId) {
      this.errorMessage = 'معرف التجمع غير موجود';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.buyingPoolService.joinPool(this.poolId).subscribe({

      next: (response) => {

        this.loading = false;

        if (response.success) {

          this.successMessage =
            'تم الانضمام إلى التجمع بنجاح';

          setTimeout(() => {
            this.router.navigate([
              '/buying-pools',
              this.poolId
            ]);
          }, 1000);
        }
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'حدث خطأ أثناء الانضمام إلى التجمع';
      }
    });
  }
}
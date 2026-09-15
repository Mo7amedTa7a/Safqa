// Member 3 - Available Pools [Supplier]
// GET /api/buying-pools
// OPEN pools يقدر الـ Supplier يقدم عليها
// لو مش ACTIVE → بيعرض سبب المنع
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BuyingPoolService } from '../../buying-pools/services/buying-pool.service';
import { BuyingPool } from '../../buying-pools/models/buying-pool.model';

@Component({
  selector: 'app-available-offers',
  standalone: true,
  imports: [RouterLink,DatePipe],
  templateUrl: './available-pools.component.html',
  styleUrl: './available-pools.component.css'
})
export class AvailableOffersComponent implements OnInit {

  private buyingPoolService = inject(BuyingPoolService);

  pools: BuyingPool[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.getAvailablePools();
  }

  getAvailablePools(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.buyingPoolService.getBuyingPools().subscribe({

      next: (response) => {

        this.isLoading = false;

        if (response.success) {
          this.pools = response.data;
        }

      },

      error: (error) => {

        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'حدث خطأ أثناء تحميل الـ Pools';

      }

    });

  }

}
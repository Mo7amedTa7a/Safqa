// Member 3 - Pool List
// GET /api/buying-pools
// OPEN pools: product, totalQuantity, memberCount, deadline countdown

import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { BuyingPoolService } from '../services/buying-pool.service';
import { BuyingPool } from '../models/buying-pool.model';

@Component({
  selector: 'app-pool-list',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './pool-list.component.html',
  styleUrl: './pool-list.component.css'
})
export class PoolListComponent implements OnInit {

  private buyingPoolService = inject(BuyingPoolService);

  pools: BuyingPool[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPools();
  }

  loadPools(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.buyingPoolService.getBuyingPools().subscribe({

      next: (response) => {

        console.log('Buying Pools:', response);

        this.pools = response.data;

        this.isLoading = false;
      },

error: (error) => {

  console.log('FULL ERROR:', error);
  console.log('STATUS:', error.status);
  console.log('URL:', error.url);
  console.log('ERROR BODY:', error.error);

  this.errorMessage =
    'حدث خطأ أثناء تحميل طلبات الشراء الجماعي';

  this.isLoading = false;
}
    });
  }
}

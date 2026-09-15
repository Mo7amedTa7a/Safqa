import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealService } from '../services/deal.service';
import { Deal } from '../models/deal.model';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.css',
})
export class DealListComponent implements OnInit {
  deals: Deal[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private dealService: DealService) {}

  ngOnInit(): void {
    this.loadDeals();
  }

  loadDeals(): void {
    this.isLoading = true;
    this.dealService.getDeals().subscribe({
      next: (response) => {
        this.deals = response.data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ أثناء تحميل الصفقات';
        this.isLoading = false;
      },
    });
  }
}

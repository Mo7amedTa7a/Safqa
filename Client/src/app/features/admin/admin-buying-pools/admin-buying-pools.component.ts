import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-buying-pools',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-buying-pools.component.html',
  styleUrl: './admin-buying-pools.component.css'
})
export class AdminBuyingPoolsComponent implements OnInit {
  pools: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPools();
  }

  loadPools(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.getBuyingPools().subscribe({
      next: (res) => {
        this.pools = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل التجمعات الشرائية.';
        this.isLoading = false;
      }
    });
  }
}

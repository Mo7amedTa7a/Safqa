import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-buying-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-buying-requests.component.html',
  styleUrl: './admin-buying-requests.component.css'
})
export class AdminBuyingRequestsComponent implements OnInit {
  requests: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.getBuyingRequests().subscribe({
      next: (res) => {
        // Filter out GROUP requests, keep only DIRECT (individual)
        this.requests = res.data.filter((req: any) => req.purchaseType === 'DIRECT');
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل طلبات الشراء الفردي.';
        this.isLoading = false;
      }
    });
  }
}

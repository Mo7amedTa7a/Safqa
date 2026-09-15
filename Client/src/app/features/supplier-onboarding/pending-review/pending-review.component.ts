import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierProfileService } from '../../../core/services/supplier-profile.service';
import { SupplierProfile } from '../../../core/models/supplier-profile.model';

@Component({
  selector: 'app-pending-review',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pending-review.component.html',
  styleUrl: './pending-review.component.css'
})
export class PendingReviewComponent implements OnInit {
  profile: SupplierProfile | null = null;
  isLoading = true;

  constructor(private supplierService: SupplierProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.supplierService.getMyProfile().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.profile = res.data || null;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models/user.model';
import { BuyerDashboardComponent } from '../buyer-dashboard/buyer-dashboard.component';
import { SupplierDashboardComponent } from '../supplier-dashboard/supplier-dashboard.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, BuyerDashboardComponent, SupplierDashboardComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User | null = null;
  UserRole = UserRole;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u?.role === UserRole.ADMIN) {
        this.router.navigate(['/admin/dashboard']);
      } else if (u?.role === UserRole.SHIPPING_PARTNER) {
        this.router.navigate(['/shipments']);
      }
    });
  }
}

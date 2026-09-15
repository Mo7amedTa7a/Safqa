import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';
import { SupplierProfileService } from '../../core/services/supplier-profile.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  isSidebarCollapsed = false;
  showSidebar = true;
  private routerSub?: Subscription;
  private authSub?: Subscription;
  private profileSub?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private supplierProfileService: SupplierProfileService
  ) { }

  ngOnInit(): void {
    // Close sidebar on mobile upon route change
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isSidebarOpen = false;
      });

    // Listen to profile updates reactively
    this.profileSub = this.supplierProfileService.profile$.subscribe(profile => {
      const user = this.authService.currentUserValue;
      if (user && user.role === UserRole.SUPPLIER) {
        this.showSidebar = profile?.verificationStatus === 'APPROVED';
      }
    });

    // If user logs out while in dashboard layout, redirect to login
    this.authSub = this.authService.currentUser$.subscribe(user => {
      const isBrowser = typeof window !== 'undefined';
      if (isBrowser && !user && !this.authService.isLoggedIn) {
        this.router.navigate(['/auth/login']);
        return;
      }

      if (user && user.role === UserRole.SUPPLIER) {
        // By default false until approved
        const cached = this.supplierProfileService.currentProfileValue;
        if (cached) {
          this.showSidebar = cached.verificationStatus === 'APPROVED';
        } else {
          this.showSidebar = false;
        }

        // Fetch latest supplier profile status
        this.supplierProfileService.getMyProfile().subscribe({
          next: (res) => {
            this.showSidebar = res.data?.verificationStatus === 'APPROVED';
          },
          error: () => {
            this.showSidebar = false;
          }
        });
      } else {
        // Buyers, Admins, etc. always see the sidebar
        this.showSidebar = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.authSub?.unsubscribe();
    this.profileSub?.unsubscribe();
  }

  toggleSidebar(): void {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 992;
    if (isMobile) {
      this.isSidebarOpen = !this.isSidebarOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}


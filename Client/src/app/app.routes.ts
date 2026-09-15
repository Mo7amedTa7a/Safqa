import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

// Layouts
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

// Home / Landing Page
import { HomeComponent } from './features/home/home.component';

// Auth Features
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';

// Dashboard & User Features
import { DashboardHomeComponent } from './features/dashboard-home/dashboard-home.component';
import { MyProfileComponent } from './features/users/my-profile/my-profile.component';
import { EditProfileComponent } from './features/users/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './features/users/change-password/change-password.component';

// Supplier Onboarding
import { CompleteProfileComponent } from './features/supplier-onboarding/complete-profile/complete-profile.component';
import { PendingReviewComponent } from './features/supplier-onboarding/pending-review/pending-review.component';
import { RejectedComponent } from './features/supplier-onboarding/rejected/rejected.component';

// Admin Features
import { UsersManagementComponent } from './features/admin/users-management/users-management.component';
import { SuppliersManagementComponent } from './features/admin/suppliers-management/suppliers-management.component';

// Buying Pools
import { PoolListComponent } from './features/buying-pools/pool-list/pool-list.component';
import { PoolDetailsComponent } from './features/buying-pools/pool-details/pool-details.component';
import { JoinComponent } from './features/buying-pools/join-pool/join-pool.component';

// Member 3 - Supplier Offers
import { CreateOfferComponent } from './features/supplier-offers/create-offer/create-offer.component';
import { AvailableOffersComponent } from './features/supplier-offers/available-pools/available-pools.component';
import { MyOffersComponent } from './features/supplier-offers/my-offers/my-offers.component';
import { OfferDetailsComponent } from './features/supplier-offers/offer-details/offer-details.component';
import { EditOfferComponent } from './features/supplier-offers/edit-offer/edit-offer.component';


export const routes: Routes = [

  // =========================================================
  // Public Landing / Home Page
  // =========================================================

  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },

  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },


  // =========================================================
  // Public Auth Routes
  // =========================================================

  {
    path: 'auth',
    component: PublicLayoutComponent,

    children: [

      {
        path: 'login',
        component: LoginComponent
      },

      {
        path: 'register',
        component: RegisterComponent
      },

      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },

      {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
      },

      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }

    ]

  },


  // =========================================================
  // Unauthorized
  // =========================================================

  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },


  // =========================================================
  // Authenticated Application / Dashboard Routes
  // =========================================================

  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],

    children: [

      // =====================================================
      // Dashboard
      // =====================================================

      {
        path: 'dashboard',
        component: DashboardHomeComponent
      },


      // =====================================================
      // Buying Pools
      // =====================================================

      {
        path: 'buying-pools',
        component: PoolListComponent
      },

      {
        path: 'buying-pools/:id',
        component: PoolDetailsComponent
      },

      {
        path: 'buying-pools/:id/join',
        component: JoinComponent
      },


      // Member 3 - Supplier Offers


      {
        path: 'supplier/available-pools',
        component: AvailableOffersComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.SUPPLIER]
        }
      },


      {
        path: 'buying-pools/:id/create-offer',
        component: CreateOfferComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.SUPPLIER]
        }
      },


      {
        path: 'supplier/my-offers',
        component: MyOffersComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.SUPPLIER]
        }
      },

      {
        path: 'supplier/offer-details/:id',
        component: OfferDetailsComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.SUPPLIER]
        }
      },



      {
        path: 'supplier/edit-offer/:id',
        component: EditOfferComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.SUPPLIER]
        }
      },


      // User Profile Routes

      {
        path: 'profile',
        component: MyProfileComponent
      },

      {
        path: 'profile/edit',
        component: EditProfileComponent
      },

      {
        path: 'profile/change-password',
        component: ChangePasswordComponent
      },


      // Supplier Onboarding Routes

      {
        path: 'supplier/complete-profile',
        component: CompleteProfileComponent
      },

      {
        path: 'supplier/pending-review',
        component: PendingReviewComponent
      },

      {
        path: 'supplier/rejected',
        component: RejectedComponent
      },


      // Admin Routes

      {
        path: 'admin/users',
        component: UsersManagementComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.ADMIN]
        }
      },

      {
        path: 'admin/suppliers',
        component: SuppliersManagementComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.ADMIN]
        }
      }

    ]

  },


  // Fallback

  {
    path: '**',
    redirectTo: ''
  }

];
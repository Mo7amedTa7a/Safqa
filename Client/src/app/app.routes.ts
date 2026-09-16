import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { UserRole } from './core/models/user.model';

// Layouts
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

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
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminBuyingPoolsComponent } from './features/admin/admin-buying-pools/admin-buying-pools.component';
import { AdminBuyingRequestsComponent } from './features/admin/admin-buying-requests/admin-buying-requests.component';
import { AdminSettlementsComponent } from './features/admin/admin-settlements/admin-settlements.component';

// Member 2 - Products & Categories
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
import { CategoryListComponent } from './features/products/category-list/category-list.component';
import { AdminProductManagementComponent } from './features/products/product-management/product-management.component';

// Member 2 - Buying Requests
import { BuyingRequestListComponent } from './features/buying-requests/my-requests/my-requests.component';
import { BuyingRequestCreateComponent } from './features/buying-requests/create-request/buying-request-create.component';
import { BuyingRequestEditComponent } from './features/buying-requests/edit-request/buying-request-edit.component';
import { BuyingRequestDetailsComponent } from './features/buying-requests/request-details/buying-request-details.component';

// Member 5 - Shipments
import { ShipmentListComponent } from './features/shipments/shipment-list/shipment-list.component';
import { ShipmentDetailsComponent } from './features/shipments/shipment-details/shipment-details.component';
import { TrackingComponent } from './features/shipments/tracking/tracking.component';

// Member 5 - Settlements
import { SettlementListComponent } from './features/settlements/settlement-list/settlement-list.component';
import { SettlementDetailsComponent } from './features/settlements/settlement-details/settlement-details.component';

// Member 5 - Disputes
import { DisputeListComponent } from './features/disputes/dispute-list/dispute-list.component';
import { DisputeDetailsComponent } from './features/disputes/dispute-details/dispute-details.component';
import { CreateDisputeComponent } from './features/disputes/create-dispute/create-dispute.component';

// Member 5 - Reviews
import { CreateReviewComponent } from './features/reviews/create-review/create-review.component';

// Member 5 - Notifications
import { NotificationCenterComponent } from './features/notifications/notification-center/notification-center.component';

// Buying Pools
import { PoolListComponent } from './features/buying-pools/pool-list/pool-list.component';
import { PoolDetailsComponent } from './features/buying-pools/pool-details/pool-details.component';
import { JoinComponent } from './features/buying-pools/join-pool/join-pool.component';
import { PoolConfirmationsComponent } from './features/buying-pools/pool-confirmations/pool-confirmations.component';

// Member 3 - Supplier Offers
import { CreateOfferComponent } from './features/supplier-offers/create-offer/create-offer.component';
import { MyOffersComponent } from './features/supplier-offers/my-offers/my-offers.component';
import { OfferDetailsComponent } from './features/supplier-offers/offer-details/offer-details.component';
import { EditOfferComponent } from './features/supplier-offers/edit-offer/edit-offer.component';

// Deals
import { DealListComponent } from './features/deals/deal-list/deal-list.component';
import { DealDetailsComponent } from './features/deals/deal-details/deal-details.component';

// Orders
import { OrderListComponent } from './features/orders/order-list/order-list.component';
import { OrderDetailsComponent } from './features/orders/order-details/order-details.component';

export const routes: Routes = [
  // Public Landing / Home Page
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

  // Public Auth Routes (Protected for Guests only)
  {
    path: 'auth',
    component: PublicLayoutComponent,
    canActivate: [noAuthGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Unauthorized
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

  // Standalone Public & Market Routes (Wrapped with Main Home Layout & Header)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'products', redirectTo: 'buying-requests', pathMatch: 'full' },
      { path: 'products/:id', redirectTo: 'buying-requests', pathMatch: 'full' },
      { path: 'categories', component: CategoryListComponent },
      { path: 'buying-requests', component: BuyingRequestListComponent },
      { path: 'buying-requests/create', component: BuyingRequestCreateComponent, canActivate: [authGuard] },
      { path: 'buying-requests/:id/edit', component: BuyingRequestEditComponent, canActivate: [authGuard] },
      {
        path: 'buying-requests/:id/create-offer',
        component: CreateOfferComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SUPPLIER] }
      },
      { path: 'buying-requests/:id', component: BuyingRequestDetailsComponent },
      { path: 'buying-pools', component: PoolListComponent },
      { path: 'buying-pools/:id/join', component: JoinComponent, canActivate: [authGuard] },
      {
        path: 'buying-pools/:id/create-offer',
        component: CreateOfferComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SUPPLIER] }
      },
      { path: 'buying-pools/:id', component: PoolDetailsComponent }
    ]
  },

  // Authenticated Application / Dashboard Routes
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'pool-confirmations', component: PoolConfirmationsComponent },

      // Management & Action Routes
      {
        path: 'admin/products',
        component: AdminProductManagementComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.SUPPLIER] }
      },

      // Supplier Offers Routes
      {
        path: 'supplier/my-offers',
        component: MyOffersComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SUPPLIER] }
      },
      {
        path: 'supplier/offer-details/:id',
        component: OfferDetailsComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SUPPLIER] }
      },
      {
        path: 'supplier/edit-offer/:id',
        component: EditOfferComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SUPPLIER] }
      },

      // User Profile Routes
      { path: 'profile', component: MyProfileComponent },
      { path: 'profile/edit', component: EditProfileComponent },
      { path: 'profile/change-password', component: ChangePasswordComponent },

      // Supplier Onboarding Routes
      { path: 'supplier/complete-profile', component: CompleteProfileComponent },
      { path: 'supplier/pending-review', component: PendingReviewComponent },
      { path: 'supplier/rejected', component: RejectedComponent },

      // Deals
      { path: 'deals', component: DealListComponent },
      { path: 'deals/:id', component: DealDetailsComponent },

      // Orders
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/:id', component: OrderDetailsComponent },

      // Admin Routes
      {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      {
        path: 'admin/users',
        component: UsersManagementComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      {
        path: 'admin/suppliers',
        component: SuppliersManagementComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      {
        path: 'admin/buying-pools',
        component: AdminBuyingPoolsComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      {
        path: 'admin/buying-requests',
        component: AdminBuyingRequestsComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      {
        path: 'admin/settlements',
        component: AdminSettlementsComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN] }
      },

      // Shipments Routes (SHIPPING_PARTNER, SUPPLIER, ADMIN)
      {
        path: 'shipments',
        component: ShipmentListComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SHIPPING_PARTNER, UserRole.SUPPLIER, UserRole.ADMIN] }
      },
      {
        path: 'shipments/track/:trackingNumber',
        component: TrackingComponent
      },
      {
        path: 'shipments/:id',
        component: ShipmentDetailsComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SHIPPING_PARTNER, UserRole.SUPPLIER, UserRole.ADMIN] }
      },

      // Settlements Routes (SHIPPING_PARTNER, SUPPLIER, ADMIN)
      {
        path: 'settlements',
        component: SettlementListComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SHIPPING_PARTNER, UserRole.SUPPLIER, UserRole.ADMIN] }
      },
      {
        path: 'settlements/:id',
        component: SettlementDetailsComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.SHIPPING_PARTNER, UserRole.SUPPLIER, UserRole.ADMIN] }
      },

      // Disputes Routes (BUYER, ADMIN)
      {
        path: 'disputes',
        component: DisputeListComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.BUYER, UserRole.ADMIN] }
      },
      {
        path: 'disputes/create/:orderId',
        component: CreateDisputeComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.BUYER] }
      },
      {
        path: 'disputes/:id',
        component: DisputeDetailsComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.BUYER, UserRole.ADMIN] }
      },

      // Reviews Routes
      {
        path: 'orders/:orderId/review',
        component: CreateReviewComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.BUYER, UserRole.SUPPLIER] }
      },

      // Notifications Route
      {
        path: 'notifications',
        component: NotificationCenterComponent
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
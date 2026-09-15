import { Routes } from '@angular/router';

import { ProductListComponent } from './features/products/product-list/ProductListComponent';
import { ProductDetailsComponent } from './features/products/product-details/ProductDetailsComponent';
import { CategoryListComponent } from './features/products/category-list/CategoryListComponent';

import { BuyingRequestListComponent } from './features/buying-requests/my-requests/MyRequestsComponent';
import { BuyingRequestCreateComponent } from './features/buying-requests/create-request/CreateRequestComponent';
import { BuyingRequestEditComponent } from './features/buying-requests/edit-request/EditRequestComponent';
import { BuyingRequestDetailsComponent } from './features/buying-requests/request-details/RequestDetailsComponent';

import { AdminProductManagementComponent } from './features/products/product-management/ProductManagementComponent';


export const routes: Routes = [

  {
    path: 'products',
    component: ProductListComponent
  },

  {
    path: 'products/:id',
    component: ProductDetailsComponent
  },

  {
    path: 'categories',
    component: CategoryListComponent
  },

  {
    path: 'buying-requests',
    component: BuyingRequestListComponent
  },

  {
    path: 'buying-requests/create',
    component: BuyingRequestCreateComponent
  },

  {
    path: 'buying-requests/:id/edit',
    component: BuyingRequestEditComponent
  },

  {
    path: 'buying-requests/:id',
    component: BuyingRequestDetailsComponent
  },

  {
    path: 'admin/products',
    component: AdminProductManagementComponent
  }

];

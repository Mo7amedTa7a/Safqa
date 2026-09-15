import { Routes } from '@angular/router';
import { PoolListComponent } from './features/buying-pools/pool-list/pool-list.component';
import { PoolDetailsComponent } from './features/buying-pools/pool-details/pool-details.component';
export const routes: Routes = [
  {
    path: 'buying-pools',
    component: PoolListComponent
  },
  {
    path: 'buying-pools/:id',
    component: PoolDetailsComponent
  }
];
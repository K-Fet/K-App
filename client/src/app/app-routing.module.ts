import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'legacy',
    loadChildren: './legacy-app/legacy-app.module#LegacyAppModule',
  },
  {
    path: 'inventory-management',
    loadChildren: './inventory-management/inventory-management.module#InventoryManagementModule',
  },
  {
    path: '',
    redirectTo: '/legacy',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'special-accounts',
    data: { permissions: { only: ['specialaccount:read'] } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: () => import('./special-accounts/special-accounts.module').then(m => m.SpecialAccountsModule),
  },
  {
    path: 'roles',
    data: { permissions: { only: ['role:read'] } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AclRoutingModule {}

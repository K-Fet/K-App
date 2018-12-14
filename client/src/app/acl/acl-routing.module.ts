import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'special-accounts',
    data: { permissions: { only: ['specialaccount:read'] } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './special-accounts/special-accounts.module#SpecialAccountsModule',
  },
  {
    path: 'roles',
    data: { permissions: { only: ['role:read'] } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './roles/roles.module#RolesModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AclRoutingModule {}

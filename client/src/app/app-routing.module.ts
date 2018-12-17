import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'acl',
    data: { permissions: { only: ['role:read', 'specialaccount:read'] } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './acl/acl.module#AclModule',
  },
  { path: 'stock',
    loadChildren: './stock/stock.module#StockModule',
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'barmen',
    data: { permissions: { only: 'barman:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './barmen/barmen.module#BarmenModule',
  },
  {
    path: 'contact',
    loadChildren: './contact/contact.module#ContactModule',
  },
  {
    path: 'inventory-management',
    loadChildren: './inventory-management/inventory-management.module#InventoryManagementModule',
  },
  {
    path: 'kommissions',
    data: { permissions: { only: 'kommission:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './kommissions/kommissions.module#KommissionsModule',
  },
  {
    path: 'members',
    data: { permissions: { only: 'member:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './members/members.module#MembersModule',
  },
  {
    path: 'services',
    data: { permissions: { only: 'service:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './services/services.module#ServicesModule',
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule',
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: true,
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}

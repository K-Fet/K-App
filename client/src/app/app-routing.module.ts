import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'acl',
    data: { permissions: { only: ['roles:read', 'special-accounts:read'] } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './acl/acl.module#AclModule',
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'barmen',
    data: { permissions: { only: 'barmen:read' } },
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
    data: { permissions: { only: 'kommissions:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './kommissions/kommissions.module#KommissionsModule',
  },
  {
    path: 'members',
    data: { permissions: { only: 'members:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: './members/members.module#MembersModule',
  },
  {
    path: 'services',
    data: { permissions: { only: 'services:read' } },
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
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}

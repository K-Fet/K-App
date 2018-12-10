import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { PresentationComponent } from './presentation/presentation.component';

const routes: Routes = [
  {
    path: 'acl',
    loadChildren: './acl/acl.module#AclModule',
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'barmen',
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
    loadChildren: './kommissions/kommissions.module#KommissionsModule',
  },
  {
    path: 'members',
    loadChildren: './members/members.module#MembersModule',
  },
  {
    path: 'services',
    loadChildren: './services/services.module#ServicesModule',
  },
  {
    path: 'presentation',
    component: PresentationComponent,
  },
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
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

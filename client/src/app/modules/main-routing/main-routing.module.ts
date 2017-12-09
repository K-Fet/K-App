import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadChildren: '../login/login.module#LoginModule' },
  { path: 'roles', loadChildren: '../roles/roles.module#RolesModule' },
  { path: 'members',  loadChildren: '../members/members.module#MembersModule' },
  { path: 'barmen',  loadChildren: '../barmen/barmen.module#BarmenModule' },
  { path: 'kommissions',  loadChildren: '../kommissions/kommissions.module#KommissionsModule' },
  { path: 'services',  loadChildren: '../services/services.module#ServicesModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class MainRoutingModule { }

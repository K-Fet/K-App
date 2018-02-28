import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './_guards/auth.guard';

// Components
import { LoginComponent } from './login/login.component';
import { MembersListComponent } from './members/list/members-list.component';
import { MemberNewComponent } from './members/new/member-new.component';
import { MemberEditComponent } from './members/edit/member-edit.component';
import { KommissionsListComponent } from './kommissions/list/kommissions-list.component';
import { KommissionNewComponent } from './kommissions/new/kommission-new.component';
import { KommissionEditComponent } from './kommissions/edit/kommission-edit.component';
import { RolesListComponent } from './roles/list/roles-list.component';
import { RoleNewComponent } from './roles/new/role-new.component';
import { RoleEditComponent } from './roles/edit/role-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlanMyServicesComponent } from './services/plan-my-services/plan-my-services.component';
import { BarmenListComponent } from './barmen/list/barmen-list.component';
import { BarmanNewComponent } from './barmen/new/barman-new.component';
import { BarmanViewComponent } from './barmen/view/barman-view.component';
import { BarmanEditComponent } from './barmen/edit/barman-edit.component';
import { NotFoundComponent } from './404/not-found.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'members', component: MembersListComponent, canActivate: [AuthGuard] },
    { path: 'members/new', component: MemberNewComponent, canActivate: [AuthGuard] },
    { path: 'members/:id', component: MemberEditComponent, canActivate: [AuthGuard] },
    { path: 'kommissions', component: KommissionsListComponent, canActivate: [AuthGuard] },
    { path: 'kommissions/new', component: KommissionNewComponent, canActivate: [AuthGuard] },
    { path: 'kommissions/:id', component: KommissionEditComponent, canActivate: [AuthGuard] },
    { path: 'roles', component: RolesListComponent, canActivate: [AuthGuard] },
    { path: 'roles/new', component: RoleNewComponent, canActivate: [AuthGuard] },
    { path: 'roles/:id', component: RoleEditComponent, canActivate: [AuthGuard] },
    { path: 'services/plan-my-services', component: PlanMyServicesComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'barmen', component: BarmenListComponent, canActivate: [AuthGuard] },
    { path: 'barmen/new', component: BarmanNewComponent, canActivate: [AuthGuard] },
    { path: 'barmen/:id/edit', component: BarmanEditComponent, canActivate: [AuthGuard] },
    { path: 'barmen/:id', component: BarmanViewComponent, canActivate: [AuthGuard] },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' }
];

export const routing = RouterModule.forRoot(routes);

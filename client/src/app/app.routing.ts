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
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlanMyServicesComponent } from './services/plan-my-services/plan-my-services.component';
import { BarmenListComponent } from './barmen/list/barmen-list.component';
import { BarmanNewComponent } from './barmen/new/barman-new.component';
import { BarmanViewComponent } from './barmen/view/barman-view.component';
import { BarmanEditComponent } from './barmen/edit/barman-edit.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'members', component: MembersListComponent, canActivate: [AuthGuard] },
    { path: 'members/new', component: MemberNewComponent, canActivate: [AuthGuard] },
    { path: 'members/:id', component: MemberEditComponent, canActivate: [AuthGuard] },
    { path: 'services/plan-my-services', component: PlanMyServicesComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'barmen', component: BarmenListComponent, canActivate: [AuthGuard] },
    { path: 'barmen/new', component: BarmanNewComponent, canActivate: [AuthGuard] },
    { path: 'barmen/:id/edit', component: BarmanEditComponent, canActivate: [AuthGuard] },
    { path: 'barmen/:id', component: BarmanViewComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/dashboard' }
];

export const routing = RouterModule.forRoot(routes);

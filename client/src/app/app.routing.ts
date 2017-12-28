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

const routes: Routes = [
    { path: '', redirectTo: '/members', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'members', component: MembersListComponent, canActivate: [AuthGuard] },
    { path: 'members/new', component: MemberNewComponent, canActivate: [AuthGuard] },
    { path: 'members/:id', component: MemberEditComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);

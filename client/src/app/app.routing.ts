import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './_guards/auth.guard';

// Components
import { LoginComponent } from './login/login.component';
import { MembersListComponent } from './members/list/members-list.component';

const routes: Routes = [
    { path: '', redirectTo: '/members', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'members', component: MembersListComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);

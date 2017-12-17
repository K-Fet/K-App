import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './_guards/auth.guard';

// Components
import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './users/list/users-list.component';
import { UserNewComponent } from './users/new/user-new.component';
import { UserEditComponent } from './users/edit/user-edit.component';

const routes: Routes = [
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
    { path: 'users/new', component: UserNewComponent, canActivate: [AuthGuard] },
    { path: 'users/:id', component: UserEditComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);

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
import { OpenServicesComponent } from './services/open-services/open-services.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const generateData = (permissions: Array<String>) => {
    return {
        permissions: {
            only: permissions,
            redirectTo: '/dashboard'
        }
    };
};

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'members', component: MembersListComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['member:read']) },
    { path: 'members/new', component: MemberNewComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['member:write']) },
    { path: 'members/:id', component: MemberEditComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['member:write']) },
    { path: 'kommissions', component: KommissionsListComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['kommission:read']) },
    { path: 'kommissions/new', component: KommissionNewComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['kommission:write']) },
    { path: 'kommissions/:id', component: KommissionEditComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['kommission:write']) },
    { path: 'roles', component: RolesListComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['role:read']) },
    { path: 'roles/new', component: RoleNewComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['role:write']) },
    { path: 'roles/:id', component: RoleEditComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['role:write']) },
    { path: 'services/plan-my-services', component: PlanMyServicesComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['service:write']) },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'barmen', component: BarmenListComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['barman:read']) },
    { path: 'barmen/new', component: BarmanNewComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['barman:write']) },
    { path: 'barmen/:id/edit', component: BarmanEditComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['barman:write']) },
    { path: 'barmen/:id', component: BarmanViewComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['barman:read']) },
    { path: 'open-services', component: OpenServicesComponent, canActivate: [AuthGuard, NgxPermissionsGuard],
        data: generateData(['service:write']) },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' }
];

export const routing = RouterModule.forRoot(routes);

import { RouterModule, Routes } from '@angular/router';

// Guards
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EditGuard } from './_guards/edit.guard';

// Components
import { LoginComponent } from './auth/login/login.component';
import { MembersListComponent } from './members/list/members-list.component';
import { MemberNewComponent } from './members/new/member-new.component';
import { MemberEditComponent } from './members/edit/member-edit.component';
import { KommissionsListComponent } from './kommissions/list/kommissions-list.component';
import { KommissionNewComponent } from './kommissions/new/kommission-new.component';
import { KommissionEditComponent } from './kommissions/edit/kommission-edit.component';
import { RolesListComponent } from './roles/list/roles-list.component';
import { RoleNewComponent } from './roles/new/role-new.component';
import { RoleEditComponent } from './roles/edit/role-edit.component';
import { ServiceExplorerComponent } from './services/services-explorer/services-explorer.component';
import { PlanMyServicesComponent } from './services/plan-my-services/plan-my-services.component';
import { BarmenListComponent } from './barmen/list/barmen-list.component';
import { BarmanNewComponent } from './barmen/new/barman-new.component';
import { BarmanViewComponent } from './barmen/view/barman-view.component';
import { BarmanEditComponent } from './barmen/edit/barman-edit.component';
import { NotFoundComponent } from './404/not-found.component';
import { OpenServicesComponent } from './services/open-services/open-services.component';
import { SpecialAccountListComponent } from './special-accounts/list/special-accounts-list.component';
import { SpecialAccountEditComponent } from './special-accounts/edit/special-account-edit.component';
import { SpecialAccountNewComponent } from './special-accounts/new/special-account-new.component';
import { DefinePasswordComponent } from './auth/define-password/define-password.component';
import { UsernameVerificationComponent } from './auth/username-verification/username-verification.component';
import { TemplatesListComponent } from './templates/list/templates-list.component';
// import { TemplateNewComponent } from './templates/new/templates-new.component';
import { TemplateViewComponent } from './templates/view/template-view.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ServiceListComponent } from './services/list/services-list.component';
import { ServiceNewComponent } from './services/new/service-new.component';
import { ServiceEditComponent } from './services/edit/service-edit.component';
import { ConcertContactComponent } from './contacts/concert/concert-contact.component';
import { WebsiteContactComponent } from './contacts/website/website-contact.component';
import { LostContactComponent } from './contacts/lost/lost-contact.component';
import { EventContactComponent } from './contacts/event/event-contact.component';

const generateData = (permissions: Array<String>) => {
    return {
        permissions: {
            only: permissions,
            redirectTo: '/',
        },
    };
};

const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'define-password', component: DefinePasswordComponent },
    { path: 'username-verification', component: UsernameVerificationComponent },
    { path: 'contact/concert', component: ConcertContactComponent },
    { path: 'contact/event', component: EventContactComponent },
    { path: 'contact/lost', component: LostContactComponent },
    { path: 'contact/website', component: WebsiteContactComponent },
    { path: 'members', component: MembersListComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['member:read']) },
    { path: 'members/new', component: MemberNewComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['member:write']) },
    { path: 'members/:id', component: MemberEditComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['member:write']) },
    { path: 'kommissions', component: KommissionsListComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['kommission:read']) },
    { path: 'kommissions/new', component: KommissionNewComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['kommission:write']) },
    { path: 'kommissions/:id', component: KommissionEditComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['kommission:write']) },
    { path: 'roles', component: RolesListComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['role:read']) },
    { path: 'roles/new', component: RoleNewComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['role:write']) },
    { path: 'roles/:id', component: RoleEditComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['role:write']) },
    { path: 'services/plan-my-services', component: PlanMyServicesComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['SERVICE_PLAN']) },
    { path: 'services-explorer', component: ServiceExplorerComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['service:read']) },
    { path: 'services-manager', component: ServiceListComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['service:read']) },
    { path: 'services-manager/new', component: ServiceNewComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['service:write']) },
    { path: 'services-manager/:id', component: ServiceEditComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['service:write']) },
    { path: 'barmen', component: BarmenListComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['barman:read']) },
    { path: 'barmen/new', component: BarmanNewComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['barman:write']) },
    { path: 'barmen/:id/edit', component: BarmanEditComponent, canActivate: [EditGuard] },
    { path: 'barmen/:id', component: BarmanViewComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['barman:read']) },
    { path: 'open-services', component: OpenServicesComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['SERVICE_MANAGER']) },
    { path: 'specialaccounts', component: SpecialAccountListComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['specialaccount:read']) },
    { path: 'specialaccounts/new', component: SpecialAccountNewComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['specialaccount:write']) },
    { path: 'specialaccounts/:id', component: SpecialAccountEditComponent, canActivate: [EditGuard] },
    { path: 'templates', component: TemplatesListComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['template:read']) },
    // { path: 'templates/new', component: TemplateNewComponent },
    { path: 'templates/:id', component: TemplateViewComponent, canActivate: [NgxPermissionsGuard],
        data: generateData(['template:read']) },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' },
];

export const routing = RouterModule.forRoot(routes);

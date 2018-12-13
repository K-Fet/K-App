import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PlanMyServicesComponent } from './plan-my-services/plan-my-services.component';
import { ServiceExplorerComponent } from './services-explorer/services-explorer.component';
import { ServiceListComponent } from './list/services-list.component';
import { ServiceNewComponent } from './new/service-new.component';
import { ServiceEditComponent } from './edit/service-edit.component';
import { OpenServicesComponent } from './open-services/open-services.component';

const routes: Routes = [
  {
    path: 'templates',
    canLoad: [NgxPermissionsGuard],
    data: { permissions: { only: ['template:read'] } },
    loadChildren: './templates/templates.module#TemplatesModule',
  },
  {
    path: 'plan-my-services',
    component: PlanMyServicesComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['SERVICE_PLAN'] } },
  },
  {
    path: 'services-explorer',
    component: ServiceExplorerComponent,
  },
  {
    path: 'services-manager',
    component: ServiceListComponent,
  },
  {
    path: 'services-manager/new',
    component: ServiceNewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['service:write'] } },
  },
  {
    path: 'services-manager/:id',
    component: ServiceEditComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['service:write'] } },
  },
  {
    path: 'open-services',
    component: OpenServicesComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['SERVICE_MANAGER'] } },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesRoutingModule {}

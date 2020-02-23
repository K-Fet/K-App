import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PlanMyServicesComponent } from './plan-my-services/plan-my-services.component';
import { ServiceExplorerComponent } from './services-explorer/services-explorer.component';
import { ServiceListComponent } from './list/services-list.component';
import { ServiceNewComponent } from './new/service-new.component';
import { ServiceEditComponent } from './edit/service-edit.component';
import { OpenServicesComponent } from './open-services/open-services.component';
import { ActiveBarmanGuard } from '../core/guards/active-barman.guard';

const routes: Routes = [
  {
    path: 'templates',
    canLoad: [NgxPermissionsGuard],
    data: { permissions: { only: ['services-templates.read'] } },
    loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule),
  },
  {
    path: 'plan-my-services',
    component: PlanMyServicesComponent,
    canActivate: [NgxPermissionsGuard, ActiveBarmanGuard],
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
    data: { permissions: { only: ['services.create'] } },
  },
  {
    path: 'services-manager/:id',
    component: ServiceEditComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['services.write'] } },
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

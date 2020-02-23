import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TemplateDetailResolverService } from './template-detail-resolver.service';

const routes: Routes = [
  {
    path: 'new',
    component: NewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['services-templates.create'] } },
  },
  {
    path: ':id',
    component: ViewComponent,
    resolve: {
      template: TemplateDetailResolverService,
    },
  },
  {
    path: ':id/edit',
    component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['services-templates.write'] } },
    resolve: {
      template: TemplateDetailResolverService,
    },
  },
  {
    path: '',
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}

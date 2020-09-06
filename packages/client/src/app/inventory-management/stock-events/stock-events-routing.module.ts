import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { StockEventDetailResolverService } from '../api-services/stock-event-detail-resolver.service';

const routes: Routes = [
  {
    path: 'new',
    component: NewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:stock-events:add'] } },
  },
  {
    path: ':id/edit',
    component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:stock-events:create'] } },
    resolve: {
      stockEvent: StockEventDetailResolverService
    }
  },
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: [
          'inventory-management:stock-events:find',
          'inventory-management:stock-events:list',
        ],
      },
    },
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockEventsRoutingModule {}

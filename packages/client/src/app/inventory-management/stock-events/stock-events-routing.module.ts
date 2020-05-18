import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'new',
    component: NewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:stock-events:add'] } },
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

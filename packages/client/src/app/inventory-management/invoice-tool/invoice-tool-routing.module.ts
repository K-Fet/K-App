import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { InvoiceParse } from './invoice-parse/invoice-parse.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceParse,
    canActivate: [NgxPermissionsGuard],
    //data: { permissions: { only: ['inventory-management:products:create'] } },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceToolRoutingModule {}

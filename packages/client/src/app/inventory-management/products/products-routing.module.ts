import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailResolverService } from '../api-services/product-detail-resolver.service';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'new',
    component: NewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-products.create'] } },
  },
  {
    path: ':id',
    component: ViewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-products.read'] } },
    resolve: {
      product: ProductDetailResolverService,
    },
  },
  {
    path: ':id/edit',
    component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-products.write'] } },
    resolve: {
      product: ProductDetailResolverService,
    },
  },
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-products.read'] } },
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}

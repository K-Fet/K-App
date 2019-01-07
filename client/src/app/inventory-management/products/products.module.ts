import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { ProductsService } from './products.service';
import { ProductDetailResolverService } from './product-detail-resolver.service';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
    ViewComponent,
  ],
  providers: [
    ProductsService,
    ProductDetailResolverService,
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    ProductsRoutingModule,
  ],
})
export class ProductsModule {}

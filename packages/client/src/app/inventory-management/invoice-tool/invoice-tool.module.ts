import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { InvoiceToolRoutingModule } from './invoice-tool-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './home-page/home-page.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ArticlesComponent } from './articles/articles.component';
import { InstantStockComponent } from './instant-stock/instant-stock.component';
import { Article } from './article';

import { InvoicesService } from './services/invoices.service';
import { ParseService } from './services/parse.service';
import { ArticlesService } from './services/articles.service';
import { ProductsSubmit } from './services/products-submit.service';
import { ProductsService } from '../api-services/products.service';
import { ShelvesService } from '../api-services/shelves.service';
import { ProvidersService } from '../api-services/providers.service';
import { StockEventsService } from '../api-services/stock-events.service';


@NgModule({
  declarations: [
    HomePageComponent,
    ArticlesComponent,
    InvoicesComponent,
    InstantStockComponent
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InvoiceToolRoutingModule,
  ],
  providers: [
    InvoicesService,
    ParseService,
    ArticlesService,
    ProductsSubmit,
    ProductsService,
    StockEventsService,
    ShelvesService,
    ProvidersService,
    Article,
  ]
})
export class InvoiceToolModule {}

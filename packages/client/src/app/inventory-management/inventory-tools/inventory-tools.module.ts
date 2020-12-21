import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { InventoryToolsRoutingModule } from './inventory-tools-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './home-page/home-page.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ArticlesComponent } from './articles/articles.component';
import { InstantStockComponent } from './instant-stock/instant-stock.component';
import { Article } from './article';

import { InvoicesService } from './services/invoices.service';
import { ParseService } from './services/parse.service';
import { ArticlesService } from './services/articles.service';
import { ProductsSubmitService } from './services/products-submit.service';
import { ProductsService } from '../api-services/products.service';
import { ShelvesService } from '../api-services/shelves.service';
import { ProvidersService } from '../api-services/providers.service';
import { StockEventsService } from '../api-services/stock-events.service';
import { OptionsDialogComponent } from './options-dialog/options-dialog.component';


@NgModule({
  declarations: [
    HomePageComponent,
    ArticlesComponent,
    InvoicesComponent,
    InstantStockComponent,
    OptionsDialogComponent
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InventoryToolsRoutingModule,
  ],
  providers: [
    InvoicesService,
    ParseService,
    ArticlesService,
    ProductsSubmitService,
    ProductsService,
    StockEventsService,
    ShelvesService,
    ProvidersService,
    Article,
  ],
  entryComponents: [
    OptionsDialogComponent
  ]
})
export class InventoryToolsModule {}

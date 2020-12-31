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
import { InventoryAdjustmentModule } from './inventory-adjustment/inventory-adjustment.module';
import { AdjustmentStockService } from './services/adjustment-stock.service';
import { Stock } from './stock';
import { EditArticleDialogComponent } from './articles/edit-article-dialog/edit-article-dialog.component';
import { StocksManagementService } from './services/stocks-management.service';


@NgModule({
  declarations: [
    HomePageComponent,
    ArticlesComponent,
    InvoicesComponent,
    InstantStockComponent,
    OptionsDialogComponent,
    EditArticleDialogComponent
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InventoryToolsRoutingModule,
    InventoryAdjustmentModule
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
    AdjustmentStockService,
    StocksManagementService,
    Article,
    Stock
  ],
  entryComponents: [
    OptionsDialogComponent,
    EditArticleDialogComponent
  ]
})
export class InventoryToolsModule {}

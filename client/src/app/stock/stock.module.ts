import { NgModule } from '@angular/core';
import { StockViewComponent } from './stock-view/stock-view.component';
import { StockMenuComponent } from './stock-menu/stock-menu.component';

import {SharedModule} from "../shared/shared.module";
import { StockRoutingModule } from './stock-routing.module';

@NgModule({
  declarations: [StockViewComponent, StockMenuComponent],
  imports: [
    SharedModule,
    StockRoutingModule,
  ]
})
export class StockModule { }

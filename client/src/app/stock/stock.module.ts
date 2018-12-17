import { NgModule } from '@angular/core';
import { StockViewComponent } from './stock-view/stock-view.component';
import { StockMenuComponent } from './stock-menu/stock-menu.component';

import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [StockViewComponent, StockMenuComponent],
  imports: [
    SharedModule,
  ]
})
export class StockModule { }

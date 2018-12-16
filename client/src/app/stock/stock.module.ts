import { NgModule } from '@angular/core';
import { StockMenuComponent } from './stock-menu/stock-menu.component';

import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [StockMenuComponent],
  imports: [
    SharedModule,
  ]
})
export class StockModule { }

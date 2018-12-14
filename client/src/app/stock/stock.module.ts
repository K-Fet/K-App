import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockMenuComponent } from './stock-menu/stock-menu.component';

import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [StockMenuComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ]
})
export class StockModule { }

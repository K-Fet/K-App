import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarmenRoutingModule } from './barmen-routing.module';
import { NewComponent } from './components/new/new.component';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BarmenRoutingModule
  ],
  bootstrap: [ListComponent],
  declarations: [NewComponent, ListComponent]
})
export class BarmenModule { }

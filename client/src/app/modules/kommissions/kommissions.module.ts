import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KommissionsRoutingModule } from './kommissions-routing.module';
import { NewComponent } from './components/new/new.component';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    KommissionsRoutingModule
  ],
  bootstrap: [ListComponent],
  declarations: [NewComponent, ListComponent]
})
export class KommissionsModule { }

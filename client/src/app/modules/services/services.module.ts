import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ListComponent } from './components/list/list.component';
import { NewComponent } from './components/new/new.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ServicesRoutingModule
  ],
  bootstrap: [ListComponent],
  declarations: [NewComponent, ListComponent]
})
export class ServicesModule { }

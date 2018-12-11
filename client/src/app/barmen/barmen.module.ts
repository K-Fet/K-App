import { NgModule } from '@angular/core';

import { BarmenRoutingModule } from './barmen-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NewComponent } from './new/new.component';
import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
    ViewComponent,
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    BarmenRoutingModule,
  ],
})
export class BarmenModule {}

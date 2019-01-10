import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { ShelvesRoutingModule } from './shelves-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { ShelvesService } from './shelves.service';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
    ViewComponent,
  ],
  providers: [
    ShelvesService,
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    ShelvesRoutingModule,
  ],
})
export class ShelvesModule {}

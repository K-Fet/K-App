import { NgModule } from '@angular/core';

import { NgxPermissionsModule } from 'ngx-permissions';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { TemplatesRoutingModule } from './templates-routing.module';
import { SharedModule } from '../../shared/shared.module';

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
    TemplatesRoutingModule,
  ],
})
export class TemplatesModule {}

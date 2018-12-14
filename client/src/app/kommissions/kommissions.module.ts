import { NgModule } from '@angular/core';

import { NgxPermissionsModule } from 'ngx-permissions';
import { NewComponent } from './new/new.component';
import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { KommissionsRoutingModule } from './kommissions-routing.module';
import { TasksModule } from './tasks/tasks.module';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
    ViewComponent,
  ],
  imports: [
    SharedModule,
    TasksModule,
    NgxPermissionsModule.forChild(),
    KommissionsRoutingModule,
  ],
})
export class KommissionsModule {}
